---
author: "Sam Rhea"
date: 2019-07-20
linktitle: 🚋🌐 a sidecar named cloudflared
title: 🚋🌐 a sidecar named cloudflared
description: "Running Argo Tunnel alongside Kubernetes."
tags: ["Cloudflare",",","walkthrough"]
---

I have a bad habit of nodding along when someone brings up a topic where I only have a rough idea of the concept. I’ve done that for a couple years whenever someone mentions Kubernetes. I understood some of the detail, but if someone asked me to teach them k8s, well, all I would have for them is a nod.

I’ve been working on fixing the macro problem (be more willing to ask questions) while also addressing the micro problem (learn Kubernetes in a functional way). Google Cloud Platform provides some [fantastic materials](https://cloud.google.com/kubernetes-engine/docs/tutorials/) for getting up to speed with k8s. However, they all end with clunky steps to share a completed project with the internet. I work at Cloudflare and I’m the product manager for a tool, [Argo Tunnel](https://www.cloudflare.com/products/argo-tunnel/), that makes it easy to securely connect a server to the internet. I think I’ll move faster by bringing something I already know pretty well, Argo Tunnel, to the challenge of learning something new.

I have a few goals for this project:

* Complete the [roster](https://cloud.google.com/kubernetes-engine/docs/tutorials/#deploying-applications) of Kubernetes projects provided by GCP using Google Cloud Shell (I’m still determined to adopt Cloud Shell as the primary way I interact with GCP)
* Expose those projects to the internet without configuring firewalls or ACLs, skipping the final steps of each tutorial
* Instead, share those k8s projects to the internet at subdomains of a hostname I keep on Cloudflare through Argo Tunnel
* Use a generic YAML file to repeat this deployment model with any k8s project, including all of the GCP-provided examples

---

**This walkthrough covers how to:**

* Build Docker images, push them to a container registry, and deploy them to a Kubernetes cluster in GCP
* Convert Cloudflare origin certificates into k8s secrets
* Run a sidecar in a k8s cluster with the Cloudflare command line tool, `cloudflared`, to expose these projects to the internet via Argo Tunnel
* Create and edit a YAML file to easily configure a `cloudflared` sidecar for any k8s project

**⏲️Time to complete: 2-3 hours**

## Enabling the Kubernetes API

I’ll begin by creating a new GCP project, “k8s-hello”, in the GCP dashboard. I’m going to use the first example provided by GCP’s Kubernetes Engine docs, a [simple hello-world web application](https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app), as the basis for this walk through. At the end of the post I’ll share more about how to repeat the sidecar steps with the other tutorials.

Unlike the process to create my Redash project, I need to complete one more step in the GCP dashboard before I can get to work in the terminal. From the sidebar, I can select “Kubernetes Engine” under “Compute” to enable the Kubernetes API and related services. The operation takes a bit of time to complete, but will give me everything I need to use Kubernetes in this project.

<div style="text-align:center">
<img src ="/static/sidecar-cloudflared/cluster-create.png" class="center"/>
</div>

Once complete, I can open the [Cloud Shell](https://cloud.google.com/shell/docs/quickstart) from the GCP dashboard to start following the tutorial. I don’t need to click “Create Container” in the Kubernetes Engine page – I’ll do that in the terminal with the steps below.

## Building a Docker container image

The GCP tutorial provides code to run a simple hello-app web server. I can clone the code for that project from GitHub with the following command:

```bash
$ git clone https://github.com/GoogleCloudPlatform/kubernetes-engine-samples
```

I can confirm the code downloaded by running `$ ls` and finding that a new directory, “kubernetes-engine-samples” has been saved. I still have `cloudflared` saved to my Cloud Shell user environment from the last walkthrough. If you don’t have it in yours, you can follow the instructions in the [link](https://blog.samrhea.com/index.php/2019/04/07/a-guide-to-overanalyzing-your-media-habits/) here or in steps later in this post.

<div style="text-align:center">
<img src ="/static/sidecar-cloudflared/ls-output.png" class="center"/>
</div>

The new “kubernetes-engine-samples” directory contains a subdirectory, “hello-app”, that I’ll need to use as my namespace so I’ll change directory with the following command:

```bash
$ cd kubernetes-engine-samples/hello-app
```

I’m going to use the code in that subdirectory to build a Docker image, a snapshot of the container that will run my hello-world app. A [container](https://www.docker.com/resources/what-container) includes everything my application needs to run: code, runtime, and the system tools and settings. Instead of consuming the full copy of an operating system on a VM, containers can share the OS kernel. Docker [images](https://docs.docker.com/engine/reference/commandline/image/), the snapshot that contains what I need for my container, are built using instructions in Dockerfiles. The “hello-app” subdirectory from GCP contains a Dockerfiles for this project.

Before I build the image, I’m going to take the tutorial’s advice and save myself some time by setting an environment variable. The project ID I’m using in gcloud right now is “k8s-hello-237400” and that is very inconvenient to type that each time I need it. Instead, I’ll save it as PROJECT_ID and each time I need it, I only need to input that variable instead of the entire name.

```bash
$ export PROJECT_ID="$(gcloud config get-value project -q)"
```

I’ll check to confirm it worked:

```bash
$ echo “$PROJECT_ID”
```

The output of that command returns “k8s-hello-237400” – Cloud Shell has saved the variable correctly.

Now I can return to building the Docker image. I can use that environment variable and the Dockerfile in this directory to create the container snapshot. In the following command, the `-t` (or `--tag`) flag tells Docker what to name the image; the `v1` that follows the colon gives it a tag for reference.

```bash
$ docker build -t gcr.io/${PROJECT_ID}/hello-app:v1 .
```

Be sure to pay attention to the space and the period that concludes the command – if you do not add those, your command will fail. Once run, I can confirm the build was successful with the following:

```bash
$ docker images
```

<div style="text-align:center">
<img src ="/static/sidecar-cloudflared/image-output.png" class="center"/>
</div>

The output lists the repository, the tag, the image ID, and its creation time and size. I now need to upload the image to a container registry. A container registry stores images, both private and public, that container orchestration software like Kubernetes can grab as part of deploying an application. I first need to authenticate to a container registry to get permission to upload my image.

```bash
$ gcloud auth configure-docker
```

The `auth configure-docker` [command](https://cloud.google.com/sdk/gcloud/reference/auth/configure-docker) launches a Docker credential helper that will create a configuration file used to authenticate my machine to a Docker registry.  The Cloud shell provides a preconfigured authentication file that I can save. Next, I need to push the image created to the registry.

```bash
$ docker push gcr.io/${PROJECT_ID}/hello-app:v1
```

The `docker push` [command](https://docs.docker.com/engine/reference/commandline/push/) will take the image I have saved on this machine and upload it to a container registry where an orchestration platform, like Kubernetes, can grab this image and use it to schedule containers. The URL that follows the push command is the location in the container registry where the image will be uploaded (gcr.io is the Google Container Registry, but services like DockerHub or private registries can be used here as well).

## Creating a container cluster

*Note: This blog post begins to differ from the Google tutorial at this step. I’m also skipping over running the container image locally, which the Google tutorial includes.*

At this stage I have a Docker image with the “hello-app” application pushed to the Google Container Registry. I now need a container cluster where I will deploy that image. A cluster consists of a pool of VM instances running Kubernetes.

I’ll create a cluster with a single [node](https://kubernetes.io/docs/concepts/architecture/nodes/). The Kubernetes documentation defines a node much better than I can:

> A node is a worker machine in Kubernetes, previously known as a 
> minion. A node may be a VM or physical machine, depending on 
> the cluster. Each node contains the services necessary to run 
> pods and is managed by the master components. The services on a 
> node include the container runtime, kubelet and kube-proxy.
>
> **Kubernetes Documentation**

That quote mentions pods. So far, I’ve now run into containers, images, clusters and nodes. Where does a [pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/) fit?

> A pod (as in a pod of whales or pea pod) is a group of one or 
> more containers (such as Docker containers), with shared 
> storage/network, and a specification for how to run the 
> containers. A pod’s contents are always co-located and 
> co-scheduled, and run in a shared context.
>
> **Kubernetes Documentation**

Most importantly for Argo Tunnel, **containers within an IP address space and can be addressed over localhost**. I’ll use the following command to create a cluster in a single GCP [zone near me](https://cloud.google.com/compute/docs/regions-zones/) and I’ll build my pod on that cluster.

```bash
$ gcloud container clusters create hello-cluster --num-nodes=1 --zone=us-central1-a
```

## Background on the sidecar model

At this stage, I can start using `kubectl` the [Kubernetes command-line tool](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to manage my Kubernetes cluster. With the cluster active and my Docker image available in the container registry, I could use the command below to deploy the application to the active cluster.

```bash
$ kubectl run hello-web --image=gcr.io/${PROJECT_ID}/hello-app:v1 --port 8080
```

However, that would deploy the application to run on localhost:8080 and additional steps would be needed to expose the application to the internet. I have a domain on Cloudflare and I do not want to configure firewall rules or ACLs here in GCP. Instead, I’ll use Cloudflare Argo Tunnel as a Kubernetes sidecar to securely connect this application to the Cloudflare network and on to the internet.

* [**Cloudflare Argo Tunnel**](https://www.cloudflare.com/products/argo-tunnel/) can run a process on the machine to make outbound calls to Cloudflare’s network and proxy requests from a domain name to this machine. Since only outbound calls are being initiated, I can restrict ingress to the machine. An older post, here, covers Argo Tunnel in much more detail.

* A **Kubernetes sidecar** is a separate container that runs in the same [pod](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/), or cluster. The sidecar performs separate functions from the application container while being tightly integrated to the application container within the pod.

I can run Argo Tunnel in a sidecar and have the process connect over localhost to port 8080 on the application. The sidecar will make outbound calls to the Cloudflare network on behalf of a hostname I give it and proxy requests to that port on the hello-app. However, to run Argo Tunnel as a sidecar, I need to make it available as a Docker image since the sidecar itself is a container.

Cloudflare does not yet publish an official Docker image for `cloudflared`, but we’re working to add one as soon as possible. Rough instructions are available [here](https://developers.cloudflare.com/argo-tunnel/reference/docker/) for building `cloudflared` as a Docker container. I’m going to use one that a teammate built and stored in a public container registry, but I do not recommend this particular image for production right now. When we publish an official one we’ll announce it with official documentation.

Even though Kubernetes will grab the Docker image from a container registry, I still need a copy of `cloudflared` available here so I can authenticate. Argo Tunnel authenticates machines using a certificate that is provided when a user logs in to their Cloudflare account. I need to get that certificate and convert it into a Kubernetes secret so that my deployments to the cluster can automatically authenticate.

```bash
$ wget https://bin.equinox.io/c/VdrWdbjqyF/cloudflared-stable-linux-amd64.deb
$ sudo dpkg -i ./cloudflared-stable-linux-amd64.deb
$ cloudflared login
```

The commands above will download a copy of `cloudflared`, unpackage it, and provide a URL I can use to login to my Cloudflare account and download a certificate that will cover subdomains of “samrhea.com” – the site I’ll use for my application.

I still need to convert that certificate into a [secret](https://kubernetes.io/docs/concepts/configuration/secret/), an object that Kubernetes can securely use to configure my pod while reducing risk of exposure of sensitive data. When `cloudflared` completed my authentication, the tool saved my certificate to a directory on this machine. I’ll run the following command to convert that certificate into a k8s secret.

```bash
$ kubectl create secret generic samrhea.com --from-file="$HOME/.cloudflared/cert.pem"
```

I can confirm the secret was created successfully with the following command:

```bash
$ kubectl get secret
```

If you forget this step, when you deploy your YAML configuration to your cluster and check the logs for the container that contains `cloudflared`, you’ll get an error that looks like the screenshot below. I forgot this step a couple of times.

<div style="text-align:center">
<img src ="/static/sidecar-cloudflared/failed-mount.png" class="center"/>
</div>

This FailedMount event is a consequence of me forgetting my own instructions.

## Configuring the sidecar with `cloudflared`

I need to deploy two containers to my cluster: one with the hello-world application and one with `cloudflared` as a sidecar. To do so, I’m going to use a YAML file to configure my deployment. A YAML file is used for storing configurations and settings for a number of purposes. For example, the YAML file will define how `cloudflared` starts, what arguments it uses, and where it will find the secret that represents the origin certificate.

You can follow my example available on GitHub [here](https://gist.github.com/AustinCorridor/3453015e3b12eb23a4a977dc49b19a13). I’ll try and breakdown what some of the different sections represent so you can configure your own. I’m leaning heavily on an example provided by my teammate Matt Alberts, also available on GitHub [here](https://gist.github.com/mattalberts/20f6bfbe1acd771f502adef580328db8). I recommend opening the example on GitHub on one side of your screen and following along with the breakdown in this post on the other.

### kind: Service

The [Service section](https://kubernetes.io/docs/concepts/services-networking/service/#defining-a-service) defines a way for a given application in the pod, like the Go service from the Google tutorial, to be reached within the cluster. The example makes the pod, “hello”, available to TCP connections over port 80 with a target port that other services can map to at port 8080.

### kind: Deployment

This section defines the deployment details of the pod. Important fields to note:

| Line(s) | Detail |
|---|---|
| 34-35	| Names my hello-world application and sets the container registry URL where the cluster will pull the image. |
| 63-64 | Names the sidecar that will run `cloudflared` as tunnel and sets the container registry for the `cloudflared` image. |
| 66 | Defines the commands to be used; these are the same that would be used if I was manually creating a tunnel. |
| 67-70 | Defines the arguments that will be used, with the commands in line 66, to create the tunnel. I’m only using a small section of `cloudflared` arguments. `--url` tells the tunnel to talk to localhost:8080 where the application will be served; `--hostname` defines the subdomain to create.
| 92-95 | References the secret created earlier from my Cloudflare certificate to be used on tunnel creation. |

Cloud Shell provides an “upload file” service to upload any file from my laptop to the machine. I can use that to upload my YAML file and then move it to the /hello-app directory. In this example, I’ll name it “sidecar.yaml”. I could also use VIM to create this file on the machine itself and edit it in Cloud Shell, but that would be very inconvenient compared to editing it on my IDE.

## Applying the file and deploying to the cluster

I now have the following:

* Docker image of my “Hello, World” application uploaded to the Google Container Registry
* A Docker image of `cloudflared` in a DockerHub registry
* A Kubernetes cluster running in GCP
* A YAML file defining how to deploy to that cluster

I can now take that YAML file and apply it to the cluster, deploying the configuration to my already-running pod, with the [apply command](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply). Alternatively, I could use the create command, but apply can be reused when I mess up and need to try again.

```bash
$ Kubectl apply -f sidecar.yaml
```

That command will apply my YAML file defining what containers to create and run to the cluster I have available. I can now run the following command to check if that worked:

```bash
$ kubectl get po
```

Kubenetes [refers](https://kubernetes.io/docs/concepts/workloads/pods/pod/) to any group of on or more containers with shared storage/network as a pod. The get po command gathers detail about the containers I have running in this cluster. It should return an output that consists of the following fields:

| Field	| Description |
|---|---|
| Name | The name of my particular pod |
| Ready | The number of containers active or ready |
| Status | The status of those containers |
| Restarts | Count of times the containers have restarted. |
| Age | Age of the pod |

Once both containers have completed their deployment, I can investigate my Argo Tunnel logs and monitor the creation of connections to the Cloudflare network:

<div style="text-align:center">
<img src ="/static/sidecar-cloudflared/network-connect.png" class="center"/>
</div>

Now, if I visit “sidecar.samrhea.com”, I can see the hello-world web application, delivered through Cloudflare Argo Tunnel in my browser.

## Troubleshooting

The most difficult part, at least for me, about Kubernetes was figuring out why things were not working. The following commands helped me find logs and details that I could use to troubleshoot issues.

### Did cloudflared run?

```bash
$ kubectl logs -lapp=hello -c tunnel
```

Returns logs from the cluster in the container, tunnel, where cloudflared is running as a sidecar.

### What is going on with my cluster?

```bash
$ kubectl describe po -lapp=hello
```

Returns information about the pod, or cluster, running the containers.

### I want to burn it down and start over.

```bash
$ kubectl scale deploy hello --replicas=0
```

Effectively kills the cluster by scaling the number of replicas to zero. Once scaled to zero, the apply or `create` command can be used to start over after fixing an issue in the YAML file.

## Replacing hello-world with a guestbook

GCP provides more comprehensive tutorials for k8s projects which include requirements for in-memory data or databases to power front-end web applications. The [guestbook](https://cloud.google.com/kubernetes-engine/docs/tutorials/guestbook) example provides steps to deploy a PHP web app in front of a Redis service. I’ll skip repeating Steps 1 and 2 in this post here and instead focus on how to go off-road from the tutorial and use cloudflared as a sidecar to share the guestbook with the internet.

Step 3 of the tutorial provides detail for deploying the front-end service and the front-end container in two separate YAML files. I’m going to combine those into a single YAML file which will deploy the front-end service, the front-end container, and the cloudflared container.

The YAML file is available in another GitHub gist [here](https://gist.github.com/AustinCorridor/ccc03b72d980fb00bac992fea4dcfd0a):

```
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: guestbook
  name: guestbook
spec:
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort:
  selector:
    app: guestbook
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    app: guestbook
  name: guestbook
spec:
  replicas: 1
  selector:
    matchLabels:
      app: guestbook
  template:
    metadata:
      labels:
        app: guestbook
    spec:
      containers:
      - name: guestbook
        image: gcr.io/google-samples/gb-frontend:v4
        imagePullPolicy: Always
        env:
        - name: NODE_NAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        - name: POD_IP
          valueFrom:
            fieldRef:
              fieldPath: status.podIP
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: 100m
            memory: 40Mi
          requests:
            cpu: 20m
            memory: 40Mi
      - name: tunnel
        image: docker.io/mattalberts/cloudflared-linux-amd64:2018.11.0
        imagePullPolicy: Always
        command: ["cloudflared", "tunnel"]
        args:
        - --url=http://127.0.0.1:80
        - --hostname=guestbook.samrhea.com
        - --origincert=/etc/cloudflared/cert.pem
        env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        resources:
          limits:
            cpu: 10m
            memory: 20Mi
          requests:
            cpu: 10m
            memory: 20Mi
        volumeMounts:
        - mountPath: /etc/cloudflared
          name: tunnel-secret
          readOnly: true
      terminationGracePeriodSeconds: 60
      volumes:
      - name: tunnel-secret
        secret:
          secretName: samrhea.com
---
view rawcloudflared-gcp-guestbook.yaml hosted with ❤ by GitHub
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: guestbook
  name: guestbook
spec:
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort:
  selector:
    app: guestbook
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    app: guestbook
  name: guestbook
spec:
  replicas: 1
  selector:
    matchLabels:
      app: guestbook
  template:
    metadata:
      labels:
        app: guestbook
    spec:
      containers:
      - name: guestbook
        image: gcr.io/google-samples/gb-frontend:v4
        imagePullPolicy: Always
        env:
        - name: NODE_NAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        - name: POD_IP
          valueFrom:
            fieldRef:
              fieldPath: status.podIP
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: 100m
            memory: 40Mi
          requests:
            cpu: 20m
            memory: 40Mi
      - name: tunnel
        image: docker.io/mattalberts/cloudflared-linux-amd64:2018.11.0
        imagePullPolicy: Always
        command: ["cloudflared", "tunnel"]
        args:
        - --url=http://127.0.0.1:80
        - --hostname=guestbook.samrhea.com
        - --origincert=/etc/cloudflared/cert.pem
        env:
        - name: POD_NAME
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: POD_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        resources:
          limits:
            cpu: 10m
            memory: 20Mi
          requests:
            cpu: 10m
            memory: 20Mi
        volumeMounts:
        - mountPath: /etc/cloudflared
          name: tunnel-secret
          readOnly: true
      terminationGracePeriodSeconds: 60
      volumes:
      - name: tunnel-secret
        secret:
          secretName: samrhea.com
---
```

I’ll follow the same steps with the kubectl tool to finish this guestbook project by deploying it to my new cluster. After a minute or so, the hostname I defined in the YAML file will be available on the internet, proxying traffic to the guestbook frontend container through the container’s service in that cluster.

The deployment details for `cloudflared` can be added to the other tutorial projects in the same way; wherever you define the service and container for serving web traffic, add the

Note: be sure to regenerate a new tunnel secret if you are in a new Cloud Shell environment. I forgot and could not figure out what was wrong without crawling through the `cloudflared` logs with the troubleshoot commands above and finding that it was failing to locate the secret.

## Wrapping up

I stubbed my time a number of times in these examples, mostly due to forgetting an obvious step because I was so focused on getting to the next stage. That said, once I configured Argo Tunnel in a sidecar model for the first time, every other project became so trivial to complete. I could skip the handful of steps at the end of each tutorial and quickly share the project through my Cloudflare account.

It can still be easier, and will become more so. We have a ways to go to improve how we support this for our Argo Tunnel users. From an official Docker image (to save you the time of building one) to better resource usage recommendations, we’re going to keep working on this. I’m really excited about it.

I’m not an expert in Kubernetes; I probably won’t ever be. However, I did learn significantly more about the concept by actually exercising it in a way I could touch and, most importantly, break and then fix.