export const FindOneReviewSelect = {
  Book: {
    select: {
      id: true,
      title: true,
    },
  },
  comment: true,
  rating: true,
  CreatedBy: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const FindAllReviewSelect = {
  id: true,
  Book: {
    select: {
      id: true,
      title: true,
    },
  },
  rating: true,
  comment: true,
  CreatedBy: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const CreateOrEditReviewSelect = {
  id: true,
  Book: {
    select: {
      id: true,
      title: true,
    },
  },
  rating: true,
  comment: true,
};
