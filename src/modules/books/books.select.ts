const baseSelect = {
  id: true,
  title: true,
  Publisher: {
    select: {
      name: true,
    },
  },
  Author: {
    select: {
      name: true,
    },
  },
  Category: {
    select: {
      name: true,
    },
  },
};

export const CreateOrEditBookSelect = {
  ...baseSelect,
  published_at: true,
};

export const FindAllBookSelect = {
  ...baseSelect,
  image_url: true,
};

export const FindOneBookSelect = {
  ...baseSelect,
  image_url: true,
  description: true,
  published_at: true,
  CreatedBy: {
    select: {
      id: true,
      name: true,
    },
  },
  Reviews: {
    select: {
      rating: true,
      comment: true,
      CreatedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};
