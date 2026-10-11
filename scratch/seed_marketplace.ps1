$headers = @{
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieWJlc2Z0ZGt1YnNxa3RlenB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MzIyMDQsImV4cCI6MjEwNzIwODIwNH0.FGkDJ1EezLnsi5XAiLmH6hWMWtXts68ui6rW0R_H8tE"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieWJlc2Z0ZGt1YnNxa3RlenB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MzIyMDQsImV4cCI6MjEwNzIwODIwNH0.FGkDJ1EezLnsi5XAiLmH6hWMWtXts68ui6rW0R_H8tE"
};

# Delete all old rows
try {
    Invoke-RestMethod -Uri "https://wbybesftdkubsqktezpy.supabase.co/rest/v1/marketplace_items?id=not.is.null" -Headers $headers -Method Delete
} catch {}

$items = @(
    # --- 1. Electronics ---
    @{
        title = "Casio FX-991CW Scientific Calculator"
        category = "Electronics"
        description = "Casio FX-991CW Classwiz Non-Programmable Scientific Calculator, essential for Semester exams, Engineering Maths, and GATE prep."
        price = "₹650"
        condition = "Good"
        status = "available"
        image_url = "item_calculator.jpg"
        seller_name = "Rahul Verma"
        seller_phone = "9437543796"
        seller_hostel = "Hostel No 24, Room 203"
        seller_roll = "21/IT/042"
    },
    @{
        title = "SanDisk 64GB USB 3.0 Pen Drive"
        category = "Electronics"
        description = "Pre-loaded with previous 5 years semester question papers, reference PDFs and lecture recordings."
        price = "Free / Borrow"
        condition = "Like New"
        status = "available"
        image_url = "pen drive.jpg"
        seller_name = "Aman Singh"
        seller_phone = "9123456780"
        seller_hostel = "Hostel No 19, Room 312"
        seller_roll = "21/CSE/055"
    },
    @{
        title = "Arduino Uno R3 IoT Starter Kit"
        category = "Electronics"
        description = "Complete Arduino Uno R3 robotics & IoT experimental kit with ultrasonic sensors, servo motors, LCD display."
        price = "₹450"
        condition = "Good"
        status = "available"
        image_url = "item_arduino_kit.jpg"
        seller_name = "Ankit Das"
        seller_phone = "9543210987"
        seller_hostel = "Hostel No 20, Room 102"
        seller_roll = "21/EEE/078"
    },
    @{
        title = "Logitech M220 Wireless Silent Mouse"
        category = "Electronics"
        description = "Logitech M220 silent mouse with 18-month battery life, smooth optical tracking and nano USB receiver."
        price = "₹300"
        condition = "Good"
        status = "available"
        image_url = "item_mouse.jpg"
        seller_name = "Saurabh Mehta"
        seller_phone = "9876543120"
        seller_hostel = "Hostel No 21, Room 115"
        seller_roll = "22/ECE/044"
    },
    @{
        title = "Sony WH-CH520 Wireless Headphones"
        category = "Electronics"
        description = "Sony wireless Bluetooth headphones with multipoint connection, high clarity microphone for online classes."
        price = "₹950"
        condition = "Like New"
        status = "available"
        image_url = "item_headphones.jpg"
        seller_name = "Saurabh Mehta"
        seller_phone = "9876543120"
        seller_hostel = "Hostel No 21, Room 115"
        seller_roll = "22/ECE/044"
    },
    @{
        title = "Raspberry Pi 4 Model B (4GB RAM)"
        category = "Electronics"
        description = "Raspberry Pi 4 (4GB RAM) with quad-core 1.5GHz CPU, dual 4K micro-HDMI outputs, and pre-installed OS."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "item_raspberry_pi.jpg"
        seller_name = "Sneha Kumari"
        seller_phone = "9765432190"
        seller_hostel = "Hostel No 14, Room 219"
        seller_roll = "21/CSE/012"
    },

    # --- 2. Lab & Engineering ---
    @{
        title = "White Cotton Lab Coat (Size M)"
        category = "Lab & Engineering"
        description = "Pure cotton white laboratory apron coat (Size Medium) with front buttons and deep pen pockets."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "lab_coat.jpg"
        seller_name = "Priya Sharma"
        seller_phone = "9876543210"
        seller_hostel = "Hostel No 12, Room 108"
        seller_roll = "22/CHE/018"
    },
    @{
        title = "Omega Engineering Mini Drafter & Board"
        category = "Lab & Engineering"
        description = "Omega precision engineering graphics mini drafter with dual scales, heavy clamp and sheet clips."
        price = "₹400"
        condition = "Good"
        status = "available"
        image_url = "mini_drafter.jpg"
        seller_name = "Vikash Kumar"
        seller_phone = "9988776655"
        seller_hostel = "Hostel No 16, Room 405"
        seller_roll = "22/MECH/089"
    },
    @{
        title = "Camlin Engineering Drawing Set & Scale"
        category = "Lab & Engineering"
        description = "Complete Camlin engineering drawing instrument set with 30cm steel ruler and plastic sheet holder container."
        price = "₹150"
        condition = "Good"
        status = "available"
        image_url = "item_drawing_set.jpg"
        seller_name = "Ananya Roy"
        seller_phone = "9456781234"
        seller_hostel = "Hostel No 11, Room 304"
        seller_roll = "23/CHE/009"
    },
    @{
        title = "Safety Goggles & Chemistry Lab Apron"
        category = "Lab & Engineering"
        description = "Polycarbonate anti-fog protective eyewear and thick cotton apron coat for organic chemistry lab practicals."
        price = "Free / Borrow"
        condition = "Like New"
        status = "available"
        image_url = "item_goggles.jpg"
        seller_name = "Ananya Roy"
        seller_phone = "9456781234"
        seller_hostel = "Hostel No 11, Room 304"
        seller_roll = "23/CHE/009"
    },
    @{
        title = "Surveying Ranging Rod & Measuring Tape"
        category = "Lab & Engineering"
        description = "Heavy-duty 30-meter fiberglass measuring tape and 2-meter dual band surveying ranging rod for Civil survey field."
        price = "₹250"
        condition = "Good"
        status = "available"
        image_url = "item_ranging_rod.jpg"
        seller_name = "Manish Tiwari"
        seller_phone = "9845123987"
        seller_hostel = "Hostel No 23, Room 106"
        seller_roll = "21/CIV/052"
    },
    @{
        title = "Steel Toe Workshop Safety Shoes (Size 8)"
        category = "Lab & Engineering"
        description = "ISI marked leather workshop safety shoes with steel toe cap and oil-resistant anti-skid rubber soles."
        price = "₹500"
        condition = "Good"
        status = "available"
        image_url = "item_safety_shoes.jpg"
        seller_name = "Tarun Bajaj"
        seller_phone = "9812903456"
        seller_hostel = "Hostel No 21, Room 209"
        seller_roll = "21/MECH/062"
    },

    # --- 3. Books ---
    @{
        title = "CLRS Introduction to Algorithms (4th Ed)"
        category = "Books"
        description = "Introduction to Algorithms (CLRS 4th Edition) hardbound copy with handwritten notes on graph algorithms."
        price = "₹550"
        condition = "Good"
        status = "available"
        image_url = "clrs bk.jpg"
        seller_name = "Aman Singh"
        seller_phone = "9123456780"
        seller_hostel = "Hostel No 19, Room 312"
        seller_roll = "21/CSE/055"
    },
    @{
        title = "Higher Engineering Mathematics (B.S. Grewal)"
        category = "Books"
        description = "Higher Engineering Mathematics by Dr. B.S. Grewal (44th Edition). Contains linear algebra, calculus & differential equations."
        price = "₹350"
        condition = "Good"
        status = "available"
        image_url = "item_maths_book.jpg"
        seller_name = "Ankit Das"
        seller_phone = "9543210987"
        seller_hostel = "Hostel No 20, Room 102"
        seller_roll = "21/EEE/078"
    },
    @{
        title = "Fundamentals of Electric Circuits (Sadiku)"
        category = "Books"
        description = "Fundamentals of Electric Circuits by Charles K. Alexander & Matthew N.O. Sadiku (5th Edition)."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "item_circuits_book.jpg"
        seller_name = "Rohan Gupta"
        seller_phone = "9845123456"
        seller_hostel = "Hostel No 22, Room 114"
        seller_roll = "20/ECE/031"
    },
    @{
        title = "Engineering Thermodynamics (P.K. Nag)"
        category = "Books"
        description = "Engineering Thermodynamics by P.K. Nag with steam tables booklet and solved numerical problems."
        price = "₹280"
        condition = "Good"
        status = "available"
        image_url = "item_thermo_book.jpg"
        seller_name = "Vikash Kumar"
        seller_phone = "9988776655"
        seller_hostel = "Hostel No 16, Room 405"
        seller_roll = "22/MECH/089"
    },
    @{
        title = "Data Communications & Networking (Forouzan)"
        category = "Books"
        description = "Data Communications and Networking by Behrouz A. Forouzan (5th Edition) covering OSI layers and TCP/IP protocol suite."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "item_networks_book.jpg"
        seller_name = "Ritu Rani"
        seller_phone = "9543126789"
        seller_hostel = "Hostel No 13, Room 101"
        seller_roll = "21/IT/058"
    },
    @{
        title = "Operating System Concepts (Silberschatz)"
        category = "Books"
        description = "Operating System Concepts by Abraham Silberschatz (9th Edition) with chapters on Linux & Windows kernel architectures."
        price = "₹320"
        condition = "Good"
        status = "available"
        image_url = "item_os_book.svg"
        seller_name = "Sneha Kumari"
        seller_phone = "9765432190"
        seller_hostel = "Hostel No 14, Room 219"
        seller_roll = "21/CSE/012"
    },

    # --- 4. Mobility ---
    @{
        title = "Hero Sprint 26T 21-Speed Gear Bicycle"
        category = "Mobility"
        description = "Hero Sprint 26T 21-speed mountain bicycle with front suspension, mudguards and combination lock."
        price = "₹2,400"
        condition = "Good"
        status = "available"
        image_url = "bicycle.jpg"
        seller_name = "Rohan Gupta"
        seller_phone = "9845123456"
        seller_hostel = "Hostel No 22, Room 114"
        seller_roll = "20/ECE/031"
    },
    @{
        title = "Firefox Target 27.5T Mountain Bicycle"
        category = "Mobility"
        description = "Firefox Target 27.5T mountain bike with 21 Shimano gears, dual disc brakes and ergonomic handlebar grips."
        price = "Free / Borrow"
        condition = "Like New"
        status = "available"
        image_url = "bicycle.jpg"
        seller_name = "Manish Tiwari"
        seller_phone = "9845123987"
        seller_hostel = "Hostel No 23, Room 106"
        seller_roll = "21/CIV/052"
    },
    @{
        title = "Heavy Duty Steel Bicycle Cable Lock"
        category = "Mobility"
        description = "Resilient 12mm steel cable lock with vinyl coating to prevent frame scratches and custom numeric code lock."
        price = "₹120"
        condition = "Good"
        status = "available"
        image_url = "item_bicycle_lock.svg"
        seller_name = "Rohan Gupta"
        seller_phone = "9845123456"
        seller_hostel = "Hostel No 22, Room 114"
        seller_roll = "20/ECE/031"
    },
    @{
        title = "Waterproof Steel Hostel Storage Trunk"
        category = "Mobility"
        description = "Spacious galvanized iron luggage trunk with dual side handles and heavy brass lock for hostel room storage."
        price = "₹600"
        condition = "Good"
        status = "available"
        image_url = "item_storage_trunk.svg"
        seller_name = "Manish Tiwari"
        seller_phone = "9845123987"
        seller_hostel = "Hostel No 23, Room 106"
        seller_roll = "21/CIV/052"
    },
    @{
        title = "Campus Foldable 4-Tier Storage Rack"
        category = "Mobility"
        description = "Foldable 4-tier steel & fabric storage rack, easy to assemble and perfect for keeping shoes and books organized."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "item_storage_rack.svg"
        seller_name = "Priya Sharma"
        seller_phone = "9876543210"
        seller_hostel = "Hostel No 12, Room 108"
        seller_roll = "22/CHE/018"
    },
    @{
        title = "Firefox Bike LED Headlight & Horn"
        category = "Mobility"
        description = "Waterproof USB rechargeable bicycle headlight with 3 light modes and 120dB electric horn for night safety."
        price = "₹180"
        condition = "Like New"
        status = "available"
        image_url = "item_bike_light.svg"
        seller_name = "Ankit Das"
        seller_phone = "9543210987"
        seller_hostel = "Hostel No 20, Room 102"
        seller_roll = "21/EEE/078"
    },

    # --- 5. Others ---
    @{
        title = "Stainless Steel Electric Kettle (1.8L)"
        category = "Others"
        description = "Stainless steel 1.8-liter electric kettle with automatic shut-off and dry boiling protection."
        price = "₹450"
        condition = "Good"
        status = "available"
        image_url = "item_kettle.jpg"
        seller_name = "Tarun Bajaj"
        seller_phone = "9812903456"
        seller_hostel = "Hostel No 21, Room 209"
        seller_roll = "21/MECH/062"
    },
    @{
        title = "Foldable Wooden Hostel Study Table"
        category = "Others"
        description = "Ergonomic wooden laptop table with foldable metal legs, iPad/tablet groove holder and cup slot."
        price = "₹350"
        condition = "Good"
        status = "available"
        image_url = "item_table.jpg"
        seller_name = "Tarun Bajaj"
        seller_phone = "9812903456"
        seller_hostel = "Hostel No 21, Room 209"
        seller_roll = "21/MECH/062"
    },
    @{
        title = "Bajaj Minor High-Speed Personal Desk Fan"
        category = "Others"
        description = "Bajaj Minor 250mm desk fan with high air delivery, silent motor and wall mountable bracket."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "item_desk_fan.svg"
        seller_name = "Tarun Bajaj"
        seller_phone = "9812903456"
        seller_hostel = "Hostel No 21, Room 209"
        seller_roll = "21/MECH/062"
    },
    @{
        title = "Yonex Badminton Racket Pair & Shuttles"
        category = "Others"
        description = "Yonex Muscle Power badminton racket pair with tight string tension, full zip case and box of 6 Mavis 350 shuttles."
        price = "₹500"
        condition = "Like New"
        status = "available"
        image_url = "item_badminton_racket.svg"
        seller_name = "Ritu Rani"
        seller_phone = "9543126789"
        seller_hostel = "Hostel No 13, Room 101"
        seller_roll = "21/IT/058"
    },
    @{
        title = "Anchor Surge Protector Extension Board"
        category = "Others"
        description = "Anchor 4-socket surge protection power strip with master switch, neon indicator light and 2m cable."
        price = "₹200"
        condition = "Good"
        status = "available"
        image_url = "item_extension_board.svg"
        seller_name = "Rahul Verma"
        seller_phone = "9437543796"
        seller_hostel = "Hostel No 24, Room 203"
        seller_roll = "21/IT/042"
    },
    @{
        title = "Givson Acoustic Guitar with Padded Bag"
        category = "Others"
        description = "Givson Bluebird 41-inch steel-string acoustic guitar with neck allen key, plectrums, shoulder strap and waterproof padded bag."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "item_guitar.svg"
        seller_name = "Ananya Roy"
        seller_phone = "9456781234"
        seller_hostel = "Hostel No 11, Room 304"
        seller_roll = "23/CHE/009"
    }
)

foreach ($item in $items) {
    $json = $item | ConvertTo-Json -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    Invoke-RestMethod -Uri "https://wbybesftdkubsqktezpy.supabase.co/rest/v1/marketplace_items" -Headers $headers -Method Post -Body $bytes -ContentType "application/json; charset=utf-8"
}

Write-Host "Seeded $($items.Count) marketplace items successfully!"
