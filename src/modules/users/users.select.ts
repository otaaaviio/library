export const CreateOrEditUserSelect = {
  id: true,
  email: true,
  name: true,
};

export const FindOneUserSelect = {
  id: true,
  name: true,
  email: true,
  CreatedAuthors: {
    select: {
      id: true,
      name: true,
    },
  },
  CreatedBooks: {
    select: {
      id: true,
      title: true,
    },
  },
  CreatedReviews: {
    select: {
      id: true,
      comment: true,
    },
  },
  CreatedPublishers: {
    select: {
      id: true,
      name: true,
    },
  },
};
