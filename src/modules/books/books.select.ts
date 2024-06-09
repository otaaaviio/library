const baseSelect = {
    id: true,
    title: true,
    Publisher: {
        select: {
            id: true,
            name: true,
        },
    },
    Author: {
        select: {
            id: true,
            name: true,
        },
    },
    Category: {
        select: {
            id: true,
            name: true,
        },
    },
};

export const CreateOrEditBookSelect = {
    ...baseSelect,
    published_at: true,
};

export const FindAllBookSelect = {
    id: true,
    title: true,
    Images: {
        take: 1,
        where: {
            deleted_at: null,
        },
        select: {
            image_path: true,
        }
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

export const FindOneBookSelect = {
    ...baseSelect,
    description: true,
    published_at: true,
    CreatedBy: {
        select: {
            id: true,
            name: true,
        },
    },
    Images: {
        select: {
            image_path: true,
        }
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
