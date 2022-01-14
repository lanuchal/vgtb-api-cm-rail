get "/product" แสดง product ทั้งหมด

get "/productcate/:id" แสดง product ตาม type

post "/login" เช็คการ login
{
    "user_username": 157,
    "user_password":  "1234"
}

post "/register" สมัครวมาชิก
{
    "name": 157,
    "user_username": 157,
    "user_password":  "1234"
    addr"12345" ;
}

get "/user/:id" แสดงข้อมูล user 

put "/updatepass" แก้ไขรหัสผ่าน user
{
    "id": 157,
    "old_password":  "1234"
    "new_password":  "12345" ;
}

post "/upload1" อัปโหลดรูป img1 ( รูปที่อยู่ 1 )
{
    "id": 157,
    "profile1":  ไฟล์
}

post "/upload2" อัปโหลดรูป img 2 ( รูปที่อยู่ 2 )
{
    "id": 157,
    "profile2":  ไฟล์
}

put "/updateuser"   แก้ไข้ข้อมูล user
{
    "id": 157,
    "name": "aaa",
    "addr": "bbb",
    "user_tel": "ccc",
    "addr_lat": "ddd",
    "addr_long": "eee"
}

post "/select-product" เลือกสินค้า
{
    "id": 157,
    "product_id": 4,
    "price_id": 2,
    "pro_req_amount": 3
}

get "/order/:id" ดูรายการสินค้า