class ListingItem {
    constructor(
        id,
        title,
        description,
        price,
        category,
        owner,
        region,
        phone,
        images
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.owner = owner;
        this.region = region;
        this.phone = phone;
        this.images = images;
    }
}

export default ListingItem;
