import Fields from "./fields";
import Frontmatter from "./frontmatter";

interface Node {
  id: string;
  fields: Fields;
  frontmatter: Frontmatter;
  html: string;
}

export default Node;
