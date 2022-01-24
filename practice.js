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

// 5. users + posts + comments (indexBy와 groupBy)

// 5.1 특정인의 posts의 모든 comments 거르기

// 5.2 특정인의 posts에 comments 단 친구의 이름 뽑기

// 5.3 특정인의 posts에 comments 단 친구들 카운트 정보

// 5.4 특정인의 comment를 단 posts 거르기
