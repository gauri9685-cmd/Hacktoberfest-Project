$headers = @{
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieWJlc2Z0ZGt1YnNxa3RlenB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MzIyMDQsImV4cCI6MjEwNzIwODIwNH0.FGkDJ1EezLnsi5XAiLmH6hWMWtXts68ui6rW0R_H8tE"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieWJlc2Z0ZGt1YnNxa3RlenB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MzIyMDQsImV4cCI6MjEwNzIwODIwNH0.FGkDJ1EezLnsi5XAiLmH6hWMWtXts68ui6rW0R_H8tE"
};

# 1. Delete all old rows
try {
    Invoke-RestMethod -Uri "https://wbybesftdkubsqktezpy.supabase.co/rest/v1/marketplace_items?id=not.is.null" -Headers $headers -Method Delete
} catch {}

# 2. Define 30 items (6 items x 5 categories)
$items = @(
    # --- Electronics ---
    @{
        title = "Casio FX-991CW Scientific Calculator"
        category = "Electronics"
        description = "Non-programmable scientific calculator, essential for B.Tech semester exams and Engineering Maths."
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
        description = "Pre-loaded with 5 years semester PYQs, lecture notes and reference PDFs for IT and CSE."
        price = "Free / Borrow"
        condition = "Like New"
        status = "available"
        image_url = "item_pendrive.jpg"
        seller_name = "Aman Singh"
        seller_phone = "9123456780"
        seller_hostel = "Hostel No 19, Room 312"
        seller_roll = "21/CSE/055"
    },
    @{
        title = "Arduino Uno R3 IoT Starter Kit"
        category = "Electronics"
        description = "Complete robotics kit with breadboard, ultrasonic sensors, servo motors and jumper wires."
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
        description = "Compact 2.4GHz wireless optical mouse with quiet click buttons. Battery included."
        price = "₹300"
        condition = "Good"
        status = "available"
        image_url = "item_headphones.jpg"
        seller_name = "Saurabh Mehta"
        seller_phone = "9876543120"
        seller_hostel = "Hostel No 21, Room 115"
        seller_roll = "22/ECE/044"
    },
    @{
        title = "Sony WH-CH520 Wireless Headphones"
        category = "Electronics"
        description = "On-ear Bluetooth headphones with 50-hour battery life and built-in mic for online lectures."
        price = "₹950"
        condition = "Like New"
        status = "available"
        image_url = "banner_gadgets.jpg"
        seller_name = "Kunal Roy"
        seller_phone = "9765432109"
        seller_hostel = "Hostel No 17, Room 402"
        seller_roll = "20/MECH/088"
    },
    @{
        title = "Raspberry Pi 4 Model B 4GB RAM"
        category = "Electronics"
        description = "Single board computer with official case, heatsinks and 32GB MicroSD card for IoT projects."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "item_arduino_kit.jpg"
        seller_name = "Priya Nandan"
        seller_phone = "9432109876"
        seller_hostel = "Hostel No 14, Room 208"
        seller_roll = "21/IT/019"
    },

    # --- Lab & Engineering ---
    @{
        title = "White Cotton Lab Coat Size M"
        category = "Lab & Engineering"
        description = "Pure cotton white apron coat with deep pen pockets. Cleaned and sanitized for practicals."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "item_lab_coat.jpg"
        seller_name = "Priya Sharma"
        seller_phone = "9876543210"
        seller_hostel = "Hostel No 12, Room 108"
        seller_roll = "22/CHE/018"
    },
    @{
        title = "Omega Engineering Mini Drafter and Board"
        category = "Lab & Engineering"
        description = "Precision mini drafter clamp with steel scales and drawing sheet clips for 1st Year EG."
        price = "₹400"
        condition = "Good"
        status = "available"
        image_url = "item_mini_drafter.jpg"
        seller_name = "Vikash Kumar"
        seller_phone = "9988776655"
        seller_hostel = "Hostel No 16, Room 405"
        seller_roll = "22/MECH/089"
    },
    @{
        title = "Camlin Engineering Drawing Set and Scale"
        category = "Lab & Engineering"
        description = "Set squares, protractor, compass, steel scale and sheet container for graphics lab."
        price = "₹150"
        condition = "Good"
        status = "available"
        image_url = "item_mini_drafter.jpg"
        seller_name = "Deepak Raj"
        seller_phone = "9123459876"
        seller_hostel = "Hostel No 18, Room 210"
        seller_roll = "23/CIV/034"
    },
    @{
        title = "Safety Goggles and Chemistry Lab Apron"
        category = "Lab & Engineering"
        description = "Anti-fog clear protective eye goggles and heat-resistant lab coat for Chemistry practicals."
        price = "Free / Borrow"
        condition = "Like New"
        status = "available"
        image_url = "item_lab_coat.jpg"
        seller_name = "Ananya Roy"
        seller_phone = "9456781234"
        seller_hostel = "Hostel No 11, Room 304"
        seller_roll = "23/CHE/009"
    },
    @{
        title = "Surveying Ranging Rod and Measuring Tape"
        category = "Lab & Engineering"
        description = "30m steel measuring tape and 2-meter collapsible ranging rod for Civil Engineering survey lab."
        price = "₹250"
        condition = "Good"
        status = "available"
        image_url = "item_mini_drafter.jpg"
        seller_name = "Manish Tiwari"
        seller_phone = "9845123987"
        seller_hostel = "Hostel No 23, Room 106"
        seller_roll = "21/CIV/052"
    },
    @{
        title = "Steel Toe Workshop Safety Shoes Size 8"
        category = "Lab & Engineering"
        description = "Heavy-duty industrial safety shoes with steel toe cap for Mechanical workshop lab."
        price = "₹500"
        condition = "Good"
        status = "available"
        image_url = "item_lab_coat.jpg"
        seller_name = "Rishi Raj"
        seller_phone = "9765438901"
        seller_hostel = "Hostel No 22, Room 318"
        seller_roll = "22/PROD/014"
    },

    # --- Books ---
    @{
        title = "CLRS Introduction to Algorithms 4th Ed"
        category = "Books"
        description = "Standard DSA textbook with handwritten bookmarks on graph algorithms and dynamic programming."
        price = "₹550"
        condition = "Good"
        status = "available"
        image_url = "item_clrs_book.jpg"
        seller_name = "Sneha Kumari"
        seller_phone = "9765432190"
        seller_hostel = "Hostel No 14, Room 219"
        seller_roll = "21/CSE/012"
    },
    @{
        title = "Higher Engineering Mathematics B S Grewal"
        category = "Books"
        description = "44th Edition, all chapters intact. Essential reference book for 1st and 2nd year B.Tech maths."
        price = "₹350"
        condition = "Good"
        status = "available"
        image_url = "banner_books.jpg"
        seller_name = "Aditya Sinha"
        seller_phone = "9437512345"
        seller_hostel = "Hostel No 15, Room 112"
        seller_roll = "22/EEE/029"
    },
    @{
        title = "Fundamentals of Electric Circuits Sadiku"
        category = "Books"
        description = "5th Edition circuit theory textbook with solved GATE practice questions and circuit diagrams."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "banner_books.jpg"
        seller_name = "Rohit Verma"
        seller_phone = "9812345678"
        seller_hostel = "Hostel No 20, Room 204"
        seller_roll = "21/ECE/067"
    },
    @{
        title = "Engineering Thermodynamics P K Nag"
        category = "Books"
        description = "Standard Mechanical textbook with property tables and steam table chart booklet included."
        price = "₹280"
        condition = "Good"
        status = "available"
        image_url = "banner_books.jpg"
        seller_name = "Siddharth Mishra"
        seller_phone = "9765123480"
        seller_hostel = "Hostel No 16, Room 309"
        seller_roll = "22/MECH/041"
    },
    @{
        title = "Data Communications Networking Forouzan"
        category = "Books"
        description = "5th Edition Computer Networks textbook for IT and CSE batchmates with highlight notes."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "item_clrs_book.jpg"
        seller_name = "Ritu Rani"
        seller_phone = "9543126789"
        seller_hostel = "Hostel No 13, Room 101"
        seller_roll = "21/IT/058"
    },
    @{
        title = "Operating System Concepts Silberschatz"
        category = "Books"
        description = "Dinosaur book 9th Edition covering process synchronization, memory management and Linux kernel."
        price = "₹320"
        condition = "Good"
        status = "available"
        image_url = "banner_books.jpg"
        seller_name = "Abhishek Kumar"
        seller_phone = "9876541230"
        seller_hostel = "Hostel No 19, Room 408"
        seller_roll = "21/CSE/091"
    },

    # --- Mobility ---
    @{
        title = "Hero Sprint 26T 21-Speed Gear Bicycle"
        category = "Mobility"
        description = "Smooth campus commuter bike with front suspension, mudguards and heavy combination lock."
        price = "₹2,400"
        condition = "Good"
        status = "available"
        image_url = "item_bicycle.jpg"
        seller_name = "Rohan Gupta"
        seller_phone = "9845123456"
        seller_hostel = "Hostel No 22, Room 114"
        seller_roll = "20/ECE/031"
    },
    @{
        title = "Firefox Target 27.5T Mountain Bicycle"
        category = "Mobility"
        description = "Lightweight alloy frame mountain bike with dual disc brakes, ideal for fast hostel transit."
        price = "Free / Borrow"
        condition = "Like New"
        status = "available"
        image_url = "item_bicycle.jpg"
        seller_name = "Varun Kashyap"
        seller_phone = "9123890567"
        seller_hostel = "Hostel No 25, Room 201"
        seller_roll = "21/MECH/102"
    },
    @{
        title = "Heavy Duty Steel Bicycle Cable Lock"
        category = "Mobility"
        description = "12mm thick braided steel cable lock with 4-digit customizable numeric combination code."
        price = "₹120"
        condition = "Like New"
        status = "available"
        image_url = "item_bicycle.jpg"
        seller_name = "Nikhil Jain"
        seller_phone = "9765412890"
        seller_hostel = "Hostel No 21, Room 305"
        seller_roll = "22/MIN/019"
    },
    @{
        title = "Waterproof Steel Hostel Storage Trunk"
        category = "Mobility"
        description = "Large galvanized iron storage trunk with heavy brass padlock for semester break luggage storage."
        price = "₹600"
        condition = "Good"
        status = "available"
        image_url = "banner_community.jpg"
        seller_name = "Amit Singh"
        seller_phone = "9432198765"
        seller_hostel = "Hostel No 18, Room 102"
        seller_roll = "21/MET/045"
    },
    @{
        title = "Campus Foldable 4-Tier Storage Rack"
        category = "Mobility"
        description = "Multipurpose shoe and book organizer rack, easy to disassemble and set up in hostel rooms."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "banner_community.jpg"
        seller_name = "Pooja Paul"
        seller_phone = "9876123450"
        seller_hostel = "Hostel No 10, Room 215"
        seller_roll = "22/IT/033"
    },
    @{
        title = "Firefox Bike LED Headlight and Horn"
        category = "Mobility"
        description = "USB rechargeable 300 lumen front headlight with horn button for safe night riding inside campus."
        price = "₹180"
        condition = "Like New"
        status = "available"
        image_url = "item_bicycle.jpg"
        seller_name = "Shivam Pandey"
        seller_phone = "9543890123"
        seller_hostel = "Hostel No 24, Room 410"
        seller_roll = "22/EEE/081"
    },

    # --- Others ---
    @{
        title = "Stainless Steel Electric Kettle 1.8L"
        category = "Others"
        description = "1500W rapid boiling electric kettle for instant noodles, tea and coffee in hostel room."
        price = "₹450"
        condition = "Like New"
        status = "available"
        image_url = "item_kettle.jpg"
        seller_name = "Tarun Bajaj"
        seller_phone = "9812903456"
        seller_hostel = "Hostel No 21, Room 209"
        seller_roll = "21/CHE/062"
    },
    @{
        title = "Foldable Wooden Hostel Study Table"
        category = "Others"
        description = "Bedside study desk table with tablet slot and cup holder. Lightweight and portable."
        price = "₹350"
        condition = "Good"
        status = "available"
        image_url = "item_table.jpg"
        seller_name = "Megha Sharma"
        seller_phone = "9765234890"
        seller_hostel = "Hostel No 12, Room 310"
        seller_roll = "22/CSE/074"
    },
    @{
        title = "Bajaj Minor Personal Desk Fan"
        category = "Others"
        description = "Quiet high-speed table fan with adjustable tilt head, perfect for summer study sessions."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "banner_gadgets.jpg"
        seller_name = "Chandan Kumar"
        seller_phone = "9432890123"
        seller_hostel = "Hostel No 19, Room 104"
        seller_roll = "21/MECH/059"
    },
    @{
        title = "Yonex Badminton Racket Pair and Shuttles"
        category = "Others"
        description = "Pair of aluminum frame rackets with full carrying cover and box of 6 nylon shuttles."
        price = "₹500"
        condition = "Good"
        status = "available"
        image_url = "banner_community.jpg"
        seller_name = "Harsh Wardhan"
        seller_phone = "9876345120"
        seller_hostel = "Hostel No 23, Room 212"
        seller_roll = "20/CIV/098"
    },
    @{
        title = "Anchor Extension Board 4 Sockets"
        category = "Others"
        description = "2-meter heavy-duty copper extension cord with individual master switches and surge protection."
        price = "₹220"
        condition = "Like New"
        status = "available"
        image_url = "banner_gadgets.jpg"
        seller_name = "Aakash Verma"
        seller_phone = "9123450987"
        seller_hostel = "Hostel No 20, Room 316"
        seller_roll = "22/IT/011"
    },
    @{
        title = "Juarez 38-Inch Acoustic Guitar and Gig Bag"
        category = "Others"
        description = "Linden wood acoustic guitar in great condition, comes with padded gig bag, strap and plectrums."
        price = "Free / Borrow"
        condition = "Good"
        status = "available"
        image_url = "banner_community.jpg"
        seller_name = "Samir Ali"
        seller_phone = "9543901234"
        seller_hostel = "Hostel No 17, Room 105"
        seller_roll = "21/ECE/090"
    }
)

$successCount = 0
foreach ($item in $items) {
    $jsonStr = ConvertTo-Json -InputObject $item -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
    try {
        $r = Invoke-RestMethod -Uri "https://wbybesftdkubsqktezpy.supabase.co/rest/v1/marketplace_items" -Headers $headers -Method Post -Body $bytes -ContentType "application/json"
        $successCount++
    } catch {
        Write-Host "Failed to insert $($item.title): $_"
    }
}

Write-Host "✅ SEED COMPLETE: $successCount / $($items.Count) items inserted into Supabase database!"
