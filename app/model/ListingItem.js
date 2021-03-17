class ListingItem {
    constructor(
        id,
        title,
        description,
        price,
        main_category,
        sub_category,
        owner,
        prefecture,
        contact_phone,
        images,
        updatedAt
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.main_category = main_category;
        this.sub_category = sub_category;
        this.owner = owner;
        this.prefecture = prefecture;
        this.contact_phone = contact_phone;
        this.images = images;
        this.updatedAt = updatedAt;
    }
}

export default ListingItem;
