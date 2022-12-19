const getMeta = (key: string) => {
  const meta = document.getElementsByTagName("meta");

  for (let i = 0; i < meta.length; i += 1) {
    if (
      key === meta[i].getAttribute("name") ||
      key === meta[i].getAttribute("property")
    ) {
      return meta[i].getAttribute("content");
    }
  }

  return "";
};

export default getMeta;
