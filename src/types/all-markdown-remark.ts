import Edge from "./edge";

interface AllMarkdownRemark {
  edges: Array<Edge>;
  group: Array<{
    fieldValue: string;
    totalCount: number;
  }>;
}

export default AllMarkdownRemark;
