-- public.email_verifications definition

-- Drop table

-- DROP TABLE email_verifications;

CREATE TABLE email_verifications (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	email text NOT NULL,
	code text NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	expires_at timestamptz NOT NULL,
	verified bool DEFAULT false NULL,
	CONSTRAINT email_verifications_email_key UNIQUE (email),
	CONSTRAINT email_verifications_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_email_verifications_email ON public.email_verifications USING btree (email);


-- public.sequence_state definition

-- Drop table

-- DROP TABLE sequence_state;

CREATE TABLE sequence_state (
	sequence_name varchar(50) NOT NULL,
	last_reset_date date NOT NULL,
	"last_value" int8 NOT NULL,
	CONSTRAINT sequence_state_pkey PRIMARY KEY (sequence_name)
);


-- public.users definition

-- Drop table

-- DROP TABLE users;

CREATE TABLE users (
	id uuid NOT NULL,
	email text NOT NULL,
	"name" text NULL,
	avatar_url text NULL,
	terms_agreed bool DEFAULT false NULL,
	marketing_agreed bool DEFAULT false NULL,
	created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
	updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
	google_id text NULL,
	kakao_id text NULL,
	naver_id text NULL,
	last_login timestamptz NULL,
	nickname text NULL,
	login_id text NULL,
	"password" text NULL,
	phone_number text NULL,
	postcode varchar(10) NULL,
	address text NULL,
	detail_address text NULL,
	is_admin bool DEFAULT false NULL,
	is_deleted bool DEFAULT false NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT users_email_unique UNIQUE (email),
	CONSTRAINT users_login_id_key UNIQUE (login_id),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_users_google_id ON public.users USING btree (google_id);
CREATE INDEX idx_users_is_deleted ON public.users USING btree (is_deleted);
CREATE INDEX idx_users_kakao_id ON public.users USING btree (kakao_id);
CREATE INDEX idx_users_naver_id ON public.users USING btree (naver_id);


-- public.carts definition

-- Drop table

-- DROP TABLE carts;

CREATE TABLE carts (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	user_id uuid NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT carts_pkey PRIMARY KEY (id),
	CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);


-- public.categories definition

-- Drop table

-- DROP TABLE categories;

CREATE TABLE categories (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	parent_id uuid NULL,
	description text NULL,
	is_active bool DEFAULT true NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT categories_pkey PRIMARY KEY (id),
	CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES categories(id)
);


-- public.orders definition

-- Drop table

-- DROP TABLE orders;

CREATE TABLE orders (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	order_number varchar(14) NULL,
	user_id uuid NOT NULL,
	status varchar(20) DEFAULT 'pending'::character varying NOT NULL,
	shipping_name varchar(100) NOT NULL,
	shipping_phone varchar(20) NOT NULL,
	shipping_address text NOT NULL,
	shipping_detail_address text NULL,
	shipping_memo text NULL,
	payment_method varchar(20) NOT NULL,
	total_amount int4 NOT NULL,
	tid varchar(100) NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	cancel_reason text NULL,
	cancel_date timestamptz NULL,
	CONSTRAINT orders_order_number_key UNIQUE (order_number),
	CONSTRAINT orders_pkey PRIMARY KEY (id),
	CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_orders_cancel_date ON public.orders USING btree (cancel_date);
CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id);

-- Table Triggers

create trigger set_order_number before
insert
    on
    public.orders for each row
    when ((new.order_number is null)) execute function generate_order_number();


-- public.payments definition

-- Drop table

-- DROP TABLE payments;

CREATE TABLE payments (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	order_id uuid NOT NULL,
	payment_key varchar(100) NOT NULL,
	payment_method varchar(50) NOT NULL,
	payment_provider varchar(50) NOT NULL,
	amount int4 NOT NULL,
	status varchar(50) NOT NULL,
	payment_details jsonb NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT payments_pkey PRIMARY KEY (id),
	CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
CREATE INDEX idx_payments_order_id ON public.payments USING btree (order_id);
CREATE INDEX idx_payments_payment_key ON public.payments USING btree (payment_key);


-- public.products definition

-- Drop table

-- DROP TABLE products;

CREATE TABLE products (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(200) NOT NULL,
	description text NULL,
	price int4 NOT NULL,
	status varchar(20) DEFAULT 'active'::character varying NULL,
	seller_id uuid NOT NULL,
	thumbnail_url text NULL,
	origin varchar(100) NULL,
	harvest_date date NULL,
	storage_method text NULL,
	is_organic bool DEFAULT false NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	order_count int4 DEFAULT 0 NULL,
	category_id uuid NOT NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id),
	CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id),
	CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES users(id)
);
CREATE INDEX idx_products_category_id ON public.products USING btree (category_id);


-- public.product_attributes definition

-- Drop table

-- DROP TABLE product_attributes;

CREATE TABLE product_attributes (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	product_id uuid NULL,
	attribute_name varchar(100) NOT NULL,
	attribute_value varchar(255) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT product_attributes_pkey PRIMARY KEY (id),
	CONSTRAINT product_attributes_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- public.product_images definition

-- Drop table

-- DROP TABLE product_images;

CREATE TABLE product_images (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	product_id uuid NULL,
	image_url text NOT NULL,
	is_thumbnail bool DEFAULT false NULL,
	sort_order int4 DEFAULT 0 NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT product_images_pkey PRIMARY KEY (id),
	CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- public.product_inquiries definition

-- Drop table

-- DROP TABLE product_inquiries;

CREATE TABLE product_inquiries (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	product_id uuid NOT NULL,
	user_id uuid NOT NULL,
	title text NOT NULL,
	"content" text NOT NULL,
	is_private bool DEFAULT false NULL,
	status varchar(20) DEFAULT 'pending'::character varying NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT product_inquiries_pkey PRIMARY KEY (id),
	CONSTRAINT product_inquiries_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
	CONSTRAINT product_inquiries_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_product_inquiries_product_id ON public.product_inquiries USING btree (product_id);
CREATE INDEX idx_product_inquiries_user_id ON public.product_inquiries USING btree (user_id);


-- public.product_likes definition

-- Drop table

-- DROP TABLE product_likes;

CREATE TABLE product_likes (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	product_id uuid NULL,
	user_id uuid NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT product_likes_pkey PRIMARY KEY (id),
	CONSTRAINT product_likes_product_id_user_id_key UNIQUE (product_id, user_id),
	CONSTRAINT product_likes_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
	CONSTRAINT product_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);


-- public.product_options definition

-- Drop table

-- DROP TABLE product_options;

CREATE TABLE product_options (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	product_id uuid NULL,
	option_name varchar(100) NOT NULL,
	option_value varchar(100) NOT NULL,
	additional_price int4 DEFAULT 0 NULL,
	stock int4 DEFAULT 0 NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	is_default bool DEFAULT false NULL,
	CONSTRAINT product_options_pkey PRIMARY KEY (id),
	CONSTRAINT product_options_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- public.product_reviews definition

-- Drop table

-- DROP TABLE product_reviews;

CREATE TABLE product_reviews (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	product_id uuid NOT NULL,
	user_id uuid NOT NULL,
	order_id uuid NULL,
	rating int4 NOT NULL,
	"content" text NOT NULL,
	status text DEFAULT 'active'::text NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	image_url text NULL,
	CONSTRAINT product_reviews_pkey PRIMARY KEY (id),
	CONSTRAINT product_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
	CONSTRAINT product_reviews_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
	CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
	CONSTRAINT product_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_product_reviews_order_id ON public.product_reviews USING btree (order_id);
CREATE INDEX idx_product_reviews_product_id ON public.product_reviews USING btree (product_id);
CREATE INDEX idx_product_reviews_user_id ON public.product_reviews USING btree (user_id);


-- public.product_tags definition

-- Drop table

-- DROP TABLE product_tags;

CREATE TABLE product_tags (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	product_id uuid NULL,
	tag varchar(50) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT product_tags_pkey PRIMARY KEY (id),
	CONSTRAINT product_tags_product_id_tag_key UNIQUE (product_id, tag),
	CONSTRAINT product_tags_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- public.review_replies definition

-- Drop table

-- DROP TABLE review_replies;

CREATE TABLE review_replies (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	review_id uuid NOT NULL,
	user_id uuid NOT NULL,
	"content" text NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT review_replies_pkey PRIMARY KEY (id),
	CONSTRAINT review_replies_review_id_fkey FOREIGN KEY (review_id) REFERENCES product_reviews(id) ON DELETE CASCADE,
	CONSTRAINT review_replies_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_review_replies_review_id ON public.review_replies USING btree (review_id);


-- public.shipments definition

-- Drop table

-- DROP TABLE shipments;

CREATE TABLE shipments (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	order_id uuid NOT NULL,
	tracking_number varchar(50) NOT NULL,
	carrier varchar(50) NOT NULL,
	status varchar(30) DEFAULT 'ready'::character varying NOT NULL,
	shipped_at timestamptz NULL,
	delivered_at timestamptz NULL,
	tracking_details jsonb NULL,
	last_updated timestamptz NULL,
	admin_notes text NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	carrier_name varchar(100) NULL,
	CONSTRAINT shipments_pkey PRIMARY KEY (id),
	CONSTRAINT shipments_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
CREATE INDEX idx_shipments_order_id ON public.shipments USING btree (order_id);
CREATE INDEX idx_shipments_status ON public.shipments USING btree (status);
CREATE INDEX idx_shipments_tracking_number ON public.shipments USING btree (tracking_number);


-- public.shipping_addresses definition

-- Drop table

-- DROP TABLE shipping_addresses;

CREATE TABLE shipping_addresses (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	user_id uuid NOT NULL,
	recipient_name varchar(100) NOT NULL,
	phone varchar(20) NOT NULL,
	address varchar(255) NOT NULL,
	detail_address varchar(255) NULL,
	is_default bool DEFAULT false NULL,
	memo varchar(255) NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT shipping_addresses_pkey PRIMARY KEY (id),
	CONSTRAINT shipping_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_shipping_addresses_user_id ON public.shipping_addresses USING btree (user_id);
CREATE UNIQUE INDEX idx_user_default_address ON public.shipping_addresses USING btree (user_id) WHERE (is_default = true);


-- public.user_deactivation_reasons definition

-- Drop table

-- DROP TABLE user_deactivation_reasons;

CREATE TABLE user_deactivation_reasons (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	user_id uuid NOT NULL,
	reason text NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT user_deactivation_reasons_pkey PRIMARY KEY (id),
	CONSTRAINT user_deactivation_reasons_user_id_key UNIQUE (user_id),
	CONSTRAINT user_deactivation_reasons_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_deactivation_reasons_user_id ON public.user_deactivation_reasons USING btree (user_id);


-- public.cart_items definition

-- Drop table

-- DROP TABLE cart_items;

CREATE TABLE cart_items (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	cart_id uuid NULL,
	product_id uuid NULL,
	product_option_id uuid NULL,
	quantity int4 DEFAULT 1 NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT cart_items_cart_id_product_id_product_option_id_key UNIQUE (cart_id, product_id, product_option_id),
	CONSTRAINT cart_items_pkey PRIMARY KEY (id),
	CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
	CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
	CONSTRAINT cart_items_product_option_id_fkey FOREIGN KEY (product_option_id) REFERENCES product_options(id) ON DELETE SET NULL
);


-- public.inquiry_replies definition

-- Drop table

-- DROP TABLE inquiry_replies;

CREATE TABLE inquiry_replies (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	inquiry_id uuid NOT NULL,
	user_id uuid NOT NULL,
	"content" text NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT inquiry_replies_pkey PRIMARY KEY (id),
	CONSTRAINT inquiry_replies_inquiry_id_fkey FOREIGN KEY (inquiry_id) REFERENCES product_inquiries(id) ON DELETE CASCADE,
	CONSTRAINT inquiry_replies_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_inquiry_replies_inquiry_id ON public.inquiry_replies USING btree (inquiry_id);


-- public.order_items definition

-- Drop table

-- DROP TABLE order_items;

CREATE TABLE order_items (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	order_id uuid NOT NULL,
	product_id uuid NOT NULL,
	product_option_id uuid NULL,
	quantity int4 NOT NULL,
	price int4 NOT NULL,
	"options" jsonb NULL,
	created_at timestamptz DEFAULT now() NULL,
	CONSTRAINT order_items_pkey PRIMARY KEY (id),
	CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
	CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id),
	CONSTRAINT order_items_product_option_id_fkey FOREIGN KEY (product_option_id) REFERENCES product_options(id)
);
CREATE INDEX idx_order_items_order_id ON public.order_items USING btree (order_id);

-- Table Triggers

create trigger update_product_order_count_trigger after
insert
    or
delete
    on
    public.order_items for each row execute function update_product_order_count();