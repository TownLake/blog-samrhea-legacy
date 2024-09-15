import author from "./author";
import menu from "./menu";

export default {
  site: {
    siteMetadata: {
      url: "https://www.lumen.local",
      title: "Blog by John Doe",
      subtitle:
        "Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.",
      copyright: "All rights reserved.",
      postsPerPage: 4,
      author,
      menu,
    },
  },
};
