
https://api.vgtb-cm.com

get 	/product 			แสดงสินค้าทั้งหมด

get 	/productCate/:id 		แสดงสินค้าตามประเภท
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////	USER	 ////////////////////////////////////////////////////////////////////////
post	/register			สมัครสมาชิก
	{
    	 	"name":"qwae",
    		"user_username": "aaa",
    		"user_password" : "qqq"
	}

post 	/login			login สมาชิก	
	{
    		"user_username": "Larbpak",
    		"user_password" : "123456"
	}

get	/user/:id			select ข้อมูล user

put	/updatepass		แก้ไขข้อมูล pass-user
	{
    		"id" : 153,
    		old_password"33333",
    		new_password: "55555"
	}

put	/updateuser 		แก้ไขข้อมูล user
	{
    		"id" : 153,
    		"addr_number": "33333",
    		"addr_tambon" : "55555",
    		"addr_amper" : "9",
    		"addr_provine": "33333",
    		"addr_zipcode" : "55555",
    		"addr_google_map" : "9",
    		"name":"test"
	}
post 	/upload 	อัปโหลดรูปที่อยู่
	{
    		"id" : 153,
    		"profile": "ไฟล์รูป"
	}

post 	/select-product	เลือกสินค้า
{
    "id": 36,
    "product_id": 2,
    "price_id": 22,
    "pro_req_amount": 4
}
get /order/:id  เช็ค order ใน bill