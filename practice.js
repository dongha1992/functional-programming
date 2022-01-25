const commentsByPostId = _pipe(_pluck("id"), (postIds) => {
  return _filter(comments, (comment) => {
    return _contains(postIds, comment.postId);
  });
});

const postsByUserId = _pipe(
  _filter(posts, (post) => {
    return post.userId === 1;
  }),
  commentsByPostId
);

// 1. 특정인의 posts의 모든 comments 거르기

_go(
  _filter(posts, (post) => {
    return post.userId === 1;
  }),
  commentsByPostId
);

// 2. 특정인의 posts에 comments를 단 친구의 이름 뽑기

const userByComment = _pipe(
  _map((comment) => {
    return _find(users, (user) => {
      return user.id === comment.userId;
    });
  })
);

_go(
  _filter(posts, (post) => {
    return post.userId === 1;
  }),
  commentsByPostId,
  userByComment
);

// 3. 특정인의 posts에 comments 단 친구들 카운트 정보

_go(
  _filter(posts, (post) => {
    return post.userId === 1;
  }),
  commentsByPostId,
  userByComment,
  _countBy((user) => user.name)
);

// 4. 특정인이 comment 단 posts 거르기

const postByPostId = _pipe(_pluck("postId"), (postIds) => {
  return _filter(posts, (post) => {
    return _contains(postIds, post.id);
  });
});

_go(
  _filter(comments, (comment) => {
    return comment.userId === 3;
  }),
  postByPostId
);

// 5. users + posts + comments (indexBy와 groupBy)

const hashedUsers = _indexBy(users, "id");

const findUserById = (userId) => {
  return hashedUsers[userId];
};

// const mergedComments = _map(comments, (comment) => {
//   return _extend(
//     {
//       user: findUserById(comment.userId),
//     },
//     comment
//   );
// });

// comments에 userId 기준으로 user 객체 추가

const mergedComments = _go(
  comments,
  _map((comment) => {
    return _extend(
      {
        user: findUserById(comment.userId),
      },
      comment
    );
  }),
  _groupBy(_get("postId"))
);

//  [
//   {
//     user: { id: 1, name: 'ID', age: 30 },
//     id: 301,
//     body: '댓글1',
//     userId: 1,
//     postId: 201
//   },
//   {
//    ...
//   }
// ]

// posts에 postId 기준으로 comments 배열 추가

const mergedPosts = _map(posts, (post) => {
  return _extend(
    {
      comments: mergedComments[post.id],
      user: findUserById(post.userId),
    },
    post
  );
});

// {
//     comments: [
//       {
//         user: { id: 1, name: 'ID', age: 30 },
//         id: 301,
//         body: '댓글1',
//         userId: 1,
//         postId: 201
//       },
//       {
//         user: { id: 20, name: 'DH', age: 20 },
//         id: 306,
//         body: '댓글6',
//         userId: 20,
//         postId: 201
//       },
//     ],
//     user: { id: 1, name: 'ID', age: 30 },
//     id: 201,
//     body: '내용1',
//     userId: 1
//   },

// users에 posts의 userId 기준으로 posts 객체 추가

// 1) 직접 변경할 경우

_each(hashedUsers, (user) => {
  user.posts = _filter(mergedPosts, (post) => {
    return post.userId === user.id;
  });
});

// 계속 재귀가 되면서 에러남

const mergedUsers = _map(hashedUsers, (user) => {
  return _extend(
    {
      posts: _filter(mergedPosts, (post) => {
        return post.userId === user.id;
      }),
    },
    user
  );
});

// 5.1 특정인의 posts의 모든 comments 거르기

// 5.2 특정인의 posts에 comments 단 친구의 이름 뽑기

// 5.3 특정인의 posts에 comments 단 친구들 카운트 정보

// 5.4 특정인의 comment를 단 posts 거르기
