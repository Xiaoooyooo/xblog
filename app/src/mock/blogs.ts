import mockjs from "mockjs";

export function blogList(options: mockjs.MockjsRequestOptions) {
  const { url, type, body } = options;
  const { pageIndex, pageSize } = JSON.parse(body);
  return {
    code: 0,
    messag: "OK",
    data: {
      total: 100,
      pageIndex,
      pageSize,
      blogs: Array(pageSize)
        .fill(0)
        .map(() => ({
          id: mockjs.Random.guid(),
          title: mockjs.Random.ctitle(),
          text: mockjs.Random.cparagraph(),
          category: mockjs.Random.cword(),
          tags: Array(Math.round(Math.random() * 5))
            .fill(0)
            .map(() => mockjs.Random.cword()),
          url: "/blog/" + mockjs.Random.guid(),
          createdAt: mockjs.Random.datetime(),
        })),
    },
  };
}

export function blogInfo(options: mockjs.MockjsRequestOptions) {
  const { url, type, body } = options;
  const { id } = JSON.parse(body);
  return {
    code: 0,
    message: "OK",
    data: {
      id: id,
      title: mockjs.Random.ctitle(),
      text: mockjs.Random.cparagraph(),
      category: mockjs.Random.cword(),
      tags: Array(Math.round(Math.random() * 5))
        .fill(0)
        .map(() => mockjs.Random.cword()),
      url: "/blog/" + mockjs.Random.guid(),
      createdAt: mockjs.Random.datetime(),
    },
  };
}
