class ListingItem {
    constructor(
        id,
        title,
        description,
        price,
        main_category,
        sub_category,
        owner,
        region,
        contact_phone,
        images
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.main_category = main_category;
        this.sub_category = sub_category;
        this.owner = owner;
        this.region = region;
        this.contact_phone = contact_phone;
        this.images = images;
    }
}

export default ListingItem;
