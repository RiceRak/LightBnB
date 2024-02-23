INSERT INTO users (id, name, email, password)
VALUES (1, 'Shadrak Lagadi', 'shad@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(2, 'Jarome Iginla', 'iggy12@iginla.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(3, 'Elon Musk', 'elon@musk.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 2, 'Iggy House', 'Description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 300, 5, 5, 4, 'Canada', 'Kensington Rd', 'Calgary', 'Alberta', 'T2N2M8', true),
(2, 1, 'Rak House', 'Description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 199, 2, 3, 2, 'Canada', 'Spring Valley Way', 'Calgary', 'Alberta', 'T3H4V2', true),
(3, 1, 'Eco Home', 'Description', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 100, 1, 1, 1, 'Canada', 'Forbes Ave', 'North Vancouver', 'British Colombia', 'V7M1G3', false);

INSERT INTO reservations (id, start_date, end_date, property_id, guest_id)
VALUES (1, '2023-09-11', '2023-09-26', 2, 3),
(2, '2023-12-1', '2023-12-20', 2, 1),
(3, '2023-01-14', '2023-01-25', 2, 2);

INSERT INTO property_reviews (id, guest_id, property_id, reservation_id, rating, message)
VALUES(1, 1, 2, 2, 5, 'message'),
(2, 2, 2, 3, 4, 'message'),
(3, 3, 2, 1, 4, 'message');