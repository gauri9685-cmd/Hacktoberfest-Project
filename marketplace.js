/**
 * ============================================================================
 * SAFECAMPUS CONNECT V2 — CAMPUS MARKETPLACE CONTROLLER
 * Implements:
 *   - Top Banner Slider with Auto-play, Arrows & Dots
 *   - Search Bar with Enter Redirection & Dynamic Category Filter
 *   - Moving Continuous Cards Carousel with Hover-Pause
 *   - Frame 12: Item Details Pop-up Modal with Request / Cancel State
 *   - Frame 17: "Talk with AI" Chat Assistant with Fuzzy Item Recommendations
 *   - Extensible Database & API Model for backend integration
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. CAMPUS MARKETPLACE DATABASE & BACKEND MODEL
// ----------------------------------------------------------------------------
const MARKETPLACE_DATABASE = [
    // Electronics (6 Items)
    {
        id: "item-elec-001",
        name: "Casio FX-991CW Scientific Calculator",
        category: "Electronics",
        shortDesc: "Non-programmable scientific calculator, essential for B.Tech semester exams.",
        fullDesc: "Casio FX-991CW Classwiz Non-Programmable Scientific Calculator, essential for Semester exams, Engineering Maths, and GATE prep.",
        image: "item_calculator.jpg",
        lenderName: "Rahul Verma",
        lenderRoll: "21/IT/042",
        lenderHostel: "Hostel No 24",
        lenderRoom: "Room 203",
        availabilityPeriod: "5th Oct - 20th Oct",
        price: "₹650",
        phone: "9437543796",
        email: "rahul.v@bitsindri.ac.in",
        tags: ["calculator", "casio", "scientific", "maths", "electronics"]
    },
    {
        id: "item-elec-002",
        name: "SanDisk 64GB USB 3.0 Pen Drive",
        category: "Electronics",
        shortDesc: "High-speed flash drive loaded with semester notes & past papers.",
        fullDesc: "Pre-loaded with previous 5 years semester question papers, reference PDFs and lecture recordings.",
        image: "pen drive.jpg",
        lenderName: "Aman Singh",
        lenderRoll: "21/CSE/055",
        lenderHostel: "Hostel No 19",
        lenderRoom: "Room 312",
        availabilityPeriod: "Available Always",
        price: "Free / Borrow",
        phone: "9123456780",
        email: "aman.s@bitsindri.ac.in",
        tags: ["pen drive", "usb", "storage", "notes", "electronics"]
    },
    {
        id: "item-elec-003",
        name: "Arduino Uno R3 IoT Starter Kit",
        category: "Electronics",
        shortDesc: "Prototyping kit with breadboard, sensors, jumper wires & motor driver.",
        fullDesc: "Complete Arduino Uno R3 robotics & IoT experimental kit with ultrasonic sensors, servo motors, LCD display.",
        image: "item_arduino_kit.jpg",
        lenderName: "Ankit Das",
        lenderRoll: "21/EEE/078",
        lenderHostel: "Hostel No 20",
        lenderRoom: "Room 102",
        availabilityPeriod: "10th Oct - 25th Oct",
        price: "₹450",
        phone: "9543210987",
        email: "ankit.d@bitsindri.ac.in",
        tags: ["arduino", "iot", "robotics", "electronics", "sensors"]
    },
    {
        id: "item-elec-004",
        name: "Logitech M220 Wireless Silent Mouse",
        category: "Electronics",
        shortDesc: "Compact 2.4GHz wireless optical mouse with quiet click buttons.",
        fullDesc: "Logitech M220 silent mouse with 18-month battery life, smooth optical tracking and nano USB receiver.",
        image: "item_mouse.jpg",
        lenderName: "Saurabh Mehta",
        lenderRoll: "22/ECE/044",
        lenderHostel: "Hostel No 21",
        lenderRoom: "Room 115",
        availabilityPeriod: "Available Always",
        price: "₹300",
        phone: "9876543120",
        email: "saurabh.m@bitsindri.ac.in",
        tags: ["mouse", "logitech", "wireless", "electronics"]
    },
    {
        id: "item-elec-005",
        name: "Sony WH-CH520 Wireless Headphones",
        category: "Electronics",
        shortDesc: "On-ear Bluetooth headphones with 50-hour battery life.",
        fullDesc: "Sony wireless Bluetooth headphones with multipoint connection, high clarity microphone for online classes.",
        image: "item_headphones.jpg",
        lenderName: "Saurabh Mehta",
        lenderRoll: "22/ECE/044",
        lenderHostel: "Hostel No 21",
        lenderRoom: "Room 115",
        availabilityPeriod: "6th Oct - 18th Oct",
        price: "₹950",
        phone: "9876543120",
        email: "saurabh.m@bitsindri.ac.in",
        tags: ["headphones", "sony", "bluetooth", "electronics"]
    },
    {
        id: "item-elec-006",
        name: "Raspberry Pi 4 Model B (4GB RAM)",
        category: "Electronics",
        shortDesc: "Single board computer with official case & 32GB MicroSD card.",
        fullDesc: "Raspberry Pi 4 (4GB RAM) with quad-core 1.5GHz CPU, dual 4K micro-HDMI outputs, and pre-installed OS.",
        image: "item_raspberry_pi.jpg",
        lenderName: "Sneha Kumari",
        lenderRoll: "21/CSE/012",
        lenderHostel: "Hostel No 14",
        lenderRoom: "Room 219",
        availabilityPeriod: "Available Always",
        price: "Free / Borrow",
        phone: "9765432190",
        email: "sneha.k@bitsindri.ac.in",
        tags: ["raspberry pi", "python", "iot", "electronics"]
    },

    // Lab & Engineering (6 Items)
    {
        id: "item-lab-001",
        name: "White Cotton Lab Coat (Size M)",
        category: "Lab & Engineering",
        shortDesc: "Clean Size M lab coat for Chemistry & Physics practicals.",
        fullDesc: "Pure cotton white laboratory apron coat (Size Medium) with front buttons and deep pen pockets.",
        image: "lab_coat.jpg",
        lenderName: "Priya Sharma",
        lenderRoll: "22/CHE/018",
        lenderHostel: "Hostel No 12",
        lenderRoom: "Room 108",
        availabilityPeriod: "6th Oct - 14th Oct",
        price: "Free / Borrow",
        phone: "9876543210",
        email: "priya.s@bitsindri.ac.in",
        tags: ["lab coat", "apron", "chemistry", "lab", "practical"]
    },
    {
        id: "item-lab-002",
        name: "Omega Engineering Mini Drafter & Board",
        category: "Lab & Engineering",
        shortDesc: "Precision mini drafter clamp with steel scales for Engineering Graphics.",
        fullDesc: "Omega precision engineering graphics mini drafter with dual scales, heavy clamp and sheet clips.",
        image: "mini_drafter.jpg",
        lenderName: "Vikash Kumar",
        lenderRoll: "22/MECH/089",
        lenderHostel: "Hostel No 16",
        lenderRoom: "Room 405",
        availabilityPeriod: "7th Oct - 20th Oct",
        price: "₹400",
        phone: "9988776655",
        email: "vikash.k@bitsindri.ac.in",
        tags: ["drafter", "drawing", "graphics", "lab"]
    },
    {
        id: "item-lab-003",
        name: "Camlin Engineering Drawing Set & Scale",
        category: "Lab & Engineering",
        shortDesc: "Set squares, protractor, compass, steel scale & sheet tube container.",
        fullDesc: "Complete Camlin engineering drawing instrument set with 30cm steel ruler and plastic sheet holder container.",
        image: "item_drawing_set.jpg",
        lenderName: "Ananya Roy",
        lenderRoll: "23/CHE/009",
        lenderHostel: "Hostel No 11",
        lenderRoom: "Room 304",
        availabilityPeriod: "Available Always",
        price: "₹150",
        phone: "9456781234",
        email: "ananya.r@bitsindri.ac.in",
        tags: ["drawing", "set square", "scale", "graphics"]
    },
    {
        id: "item-lab-004",
        name: "Safety Goggles & Chemistry Lab Apron",
        category: "Lab & Engineering",
        shortDesc: "Anti-fog clear protective goggles & heat-resistant lab apron.",
        fullDesc: "Polycarbonate anti-fog protective eyewear and thick cotton apron coat for organic chemistry lab practicals.",
        image: "item_goggles.jpg",
        lenderName: "Ananya Roy",
        lenderRoll: "23/CHE/009",
        lenderHostel: "Hostel No 11",
        lenderRoom: "Room 304",
        availabilityPeriod: "8th Oct - 22nd Oct",
        price: "Free / Borrow",
        phone: "9456781234",
        email: "ananya.r@bitsindri.ac.in",
        tags: ["goggles", "safety", "apron", "chemistry"]
    },
    {
        id: "item-lab-005",
        name: "Surveying Ranging Rod & Measuring Tape",
        category: "Lab & Engineering",
        shortDesc: "30m steel measuring tape and 2m collapsible ranging rod.",
        fullDesc: "Heavy-duty 30-meter fiberglass measuring tape and 2-meter dual band surveying ranging rod for Civil survey field.",
        image: "item_ranging_rod.jpg",
        lenderName: "Manish Tiwari",
        lenderRoll: "21/CIV/052",
        lenderHostel: "Hostel No 23",
        lenderRoom: "Room 106",
        availabilityPeriod: "5th Oct - 15th Oct",
        price: "₹250",
        phone: "9845123987",
        email: "manish.t@bitsindri.ac.in",
        tags: ["surveying", "tape", "ranging rod", "civil"]
    },
    {
        id: "item-lab-006",
        name: "Steel Toe Workshop Safety Shoes (Size 8)",
        category: "Lab & Engineering",
        shortDesc: "Heavy-duty industrial safety shoes with steel toe cap for workshop.",
        fullDesc: "ISI marked leather workshop safety shoes with steel toe cap and oil-resistant anti-skid rubber soles.",
        image: "item_safety_shoes.jpg",
        lenderName: "Tarun Bajaj",
        lenderRoll: "21/MECH/062",
        lenderHostel: "Hostel No 21",
        lenderRoom: "Room 209",
        availabilityPeriod: "10th Oct - 30th Oct",
        price: "₹500",
        phone: "9812903456",
        email: "tarun.b@bitsindri.ac.in",
        tags: ["safety shoes", "workshop", "mechanical"]
    },

    // Books (6 Items)
    {
        id: "item-book-001",
        name: "CLRS Introduction to Algorithms (4th Ed)",
        category: "Books",
        shortDesc: "Standard algorithms textbook with annotated notes & solutions.",
        fullDesc: "Introduction to Algorithms (CLRS 4th Edition) hardbound copy with handwritten notes on graph algorithms.",
        image: "clrs bk.jpg",
        lenderName: "Aman Singh",
        lenderRoll: "21/CSE/055",
        lenderHostel: "Hostel No 19",
        lenderRoom: "Room 312",
        availabilityPeriod: "Available Always",
        price: "₹550",
        phone: "9123456780",
        email: "aman.s@bitsindri.ac.in",
        tags: ["book", "algorithms", "clrs", "dsa", "cse"]
    },
    {
        id: "item-book-002",
        name: "Higher Engineering Mathematics (B.S. Grewal)",
        category: "Books",
        shortDesc: "44th Edition B.S. Grewal for 1st & 2nd year B.Tech maths.",
        fullDesc: "Higher Engineering Mathematics by Dr. B.S. Grewal (44th Edition). Contains linear algebra, calculus & differential equations.",
        image: "item_maths_book.jpg",
        lenderName: "Ankit Das",
        lenderRoll: "21/EEE/078",
        lenderHostel: "Hostel No 20",
        lenderRoom: "Room 102",
        availabilityPeriod: "5th Oct - 25th Oct",
        price: "₹350",
        phone: "9543210987",
        email: "ankit.d@bitsindri.ac.in",
        tags: ["book", "maths", "grewal", "engineering"]
    },
    {
        id: "item-book-003",
        name: "Fundamentals of Electric Circuits (Sadiku)",
        category: "Books",
        shortDesc: "5th Edition circuit theory textbook with solved GATE questions.",
        fullDesc: "Fundamentals of Electric Circuits by Charles K. Alexander & Matthew N.O. Sadiku (5th Edition).",
        image: "item_circuits_book.jpg",
        lenderName: "Rohan Gupta",
        lenderRoll: "20/ECE/031",
        lenderHostel: "Hostel No 22",
        lenderRoom: "Room 114",
        availabilityPeriod: "Available Always",
        price: "Free / Borrow",
        phone: "9845123456",
        email: "rohan.g@bitsindri.ac.in",
        tags: ["book", "circuits", "sadiku", "eee", "ece"]
    },
    {
        id: "item-book-004",
        name: "Engineering Thermodynamics (P.K. Nag)",
        category: "Books",
        shortDesc: "Standard Mechanical textbook with property tables & steam chart.",
        fullDesc: "Engineering Thermodynamics by P.K. Nag with steam tables booklet and solved numerical problems.",
        image: "item_thermo_book.jpg",
        lenderName: "Vikash Kumar",
        lenderRoll: "22/MECH/089",
        lenderHostel: "Hostel No 16",
        lenderRoom: "Room 405",
        availabilityPeriod: "8th Oct - 20th Oct",
        price: "₹280",
        phone: "9988776655",
        email: "vikash.k@bitsindri.ac.in",
        tags: ["book", "thermodynamics", "mechanical"]
    },
    {
        id: "item-book-005",
        name: "Data Communications & Networking (Forouzan)",
        category: "Books",
        shortDesc: "5th Edition Computer Networks textbook for IT/CSE.",
        fullDesc: "Data Communications and Networking by Behrouz A. Forouzan (5th Edition) covering OSI layers and TCP/IP protocol suite.",
        image: "item_networks_book.jpg",
        lenderName: "Ritu Rani",
        lenderRoll: "21/IT/058",
        lenderHostel: "Hostel No 13",
        lenderRoom: "Room 101",
        availabilityPeriod: "Available Always",
        price: "Free / Borrow",
        phone: "9543126789",
        email: "ritu.r@bitsindri.ac.in",
        tags: ["book", "networks", "forouzan", "it", "cse"]
    },
    {
        id: "item-book-006",
        name: "Operating System Concepts (Silberschatz)",
        category: "Books",
        shortDesc: "Standard OS textbook covering process sync & memory management.",
        fullDesc: "Operating System Concepts by Abraham Silberschatz (9th Edition) with chapters on Linux & Windows kernel architectures.",
        image: "item_os_book.svg",
        lenderName: "Sneha Kumari",
        lenderRoll: "21/CSE/012",
        lenderHostel: "Hostel No 14",
        lenderRoom: "Room 219",
        availabilityPeriod: "10th Oct - 28th Oct",
        price: "₹320",
        phone: "9765432190",
        email: "sneha.k@bitsindri.ac.in",
        tags: ["book", "os", "operating system", "silberschatz"]
    },

    // Mobility (6 Items)
    {
        id: "item-mob-001",
        name: "Hero Sprint 26T 21-Speed Gear Bicycle",
        category: "Mobility",
        shortDesc: "Smooth campus commuter bike for quick transit between departments.",
        fullDesc: "Hero Sprint 26T 21-speed mountain bicycle with front suspension, mudguards and combination lock.",
        image: "bicycle.jpg",
        lenderName: "Rohan Gupta",
        lenderRoll: "20/ECE/031",
        lenderHostel: "Hostel No 22",
        lenderRoom: "Room 114",
        availabilityPeriod: "Available Always",
        price: "₹2,400",
        phone: "9845123456",
        email: "rohan.g@bitsindri.ac.in",
        tags: ["cycle", "bicycle", "mobility", "commute"]
    },
    {
        id: "item-mob-002",
        name: "Firefox Target 27.5T Mountain Bicycle",
        category: "Mobility",
        shortDesc: "Lightweight alloy frame mountain bike with dual disc brakes.",
        fullDesc: "Firefox Target 27.5T mountain bike with 21 Shimano gears, dual disc brakes and ergonomic handlebar grips.",
        image: "bicycle.jpg",
        lenderName: "Manish Tiwari",
        lenderRoll: "21/CIV/052",
        lenderHostel: "Hostel No 23",
        lenderRoom: "Room 106",
        availabilityPeriod: "Available Always",
        price: "Free / Borrow",
        phone: "9845123987",
        email: "manish.t@bitsindri.ac.in",
        tags: ["cycle", "firefox", "bicycle", "mobility"]
    },
    {
        id: "item-mob-003",
        name: "Heavy Duty Steel Bicycle Cable Lock",
        category: "Mobility",
        shortDesc: "12mm thick braided steel cable lock with 4-digit combination.",
        fullDesc: "Resilient 12mm steel cable lock with vinyl coating to prevent frame scratches and custom numeric code lock.",
        image: "item_bicycle_lock.svg",
        lenderName: "Rohan Gupta",
        lenderRoll: "20/ECE/031",
        lenderHostel: "Hostel No 22",
        lenderRoom: "Room 114",
        availabilityPeriod: "5th Oct - 20th Oct",
        price: "₹120",
        phone: "9845123456",
        email: "rohan.g@bitsindri.ac.in",
        tags: ["lock", "cable lock", "bicycle", "mobility"]
    },
    {
        id: "item-mob-004",
        name: "Waterproof Steel Hostel Storage Trunk",
        category: "Mobility",
        shortDesc: "Large iron storage trunk with heavy brass padlock for semester break.",
        fullDesc: "Spacious galvanized iron luggage trunk with dual side handles and heavy brass lock for hostel room storage.",
        image: "item_storage_trunk.svg",
        lenderName: "Manish Tiwari",
        lenderRoll: "21/CIV/052",
        lenderHostel: "Hostel No 23",
        lenderRoom: "Room 106",
        availabilityPeriod: "Available Always",
        price: "₹600",
        phone: "9845123987",
        email: "manish.t@bitsindri.ac.in",
        tags: ["trunk", "storage", "box", "mobility"]
    },
    {
        id: "item-mob-005",
        name: "Campus Foldable 4-Tier Storage Rack",
        category: "Mobility",
        shortDesc: "Multipurpose shoe & book organizer rack for hostel rooms.",
        fullDesc: "Foldable 4-tier steel & fabric storage rack, easy to assemble and perfect for keeping shoes and books organized.",
        image: "item_storage_rack.svg",
        lenderName: "Priya Sharma",
        lenderRoll: "22/CHE/018",
        lenderHostel: "Hostel No 12",
        lenderRoom: "Room 108",
        availabilityPeriod: "6th Oct - 25th Oct",
        price: "Free / Borrow",
        phone: "9876543210",
        email: "priya.s@bitsindri.ac.in",
        tags: ["rack", "storage", "organizer", "mobility"]
    },
    {
        id: "item-mob-006",
        name: "Firefox Bike LED Headlight & Horn",
        category: "Mobility",
        shortDesc: "USB rechargeable 300 lumen front headlight with horn button.",
        fullDesc: "Waterproof USB rechargeable bicycle headlight with 3 light modes and 120dB electric horn for night safety.",
        image: "item_bike_light.svg",
        lenderName: "Ankit Das",
        lenderRoll: "21/EEE/078",
        lenderHostel: "Hostel No 20",
        lenderRoom: "Room 102",
        availabilityPeriod: "10th Oct - 30th Oct",
        price: "₹180",
        phone: "9543210987",
        email: "ankit.d@bitsindri.ac.in",
        tags: ["light", "headlight", "bike", "mobility"]
    },

    // Others (6 Items)
    {
        id: "item-oth-001",
        name: "Stainless Steel Electric Kettle (1.8L)",
        category: "Others",
        shortDesc: "1500W rapid boiling electric kettle for instant noodles & tea.",
        fullDesc: "Stainless steel 1.8-liter electric kettle with automatic shut-off and dry boiling protection.",
        image: "item_kettle.jpg",
        lenderName: "Tarun Bajaj",
        lenderRoll: "21/MECH/062",
        lenderHostel: "Hostel No 21",
        lenderRoom: "Room 209",
        availabilityPeriod: "Available Always",
        price: "₹450",
        phone: "9812903456",
        email: "tarun.b@bitsindri.ac.in",
        tags: ["kettle", "electric kettle", "others"]
    },
    {
        id: "item-oth-002",
        name: "Foldable Wooden Hostel Study Table",
        category: "Others",
        shortDesc: "Bedside study desk table with tablet slot & cup holder.",
        fullDesc: "Ergonomic wooden laptop table with foldable metal legs, iPad/tablet groove holder and cup slot.",
        image: "item_table.jpg",
        lenderName: "Tarun Bajaj",
        lenderRoll: "21/MECH/062",
        lenderHostel: "Hostel No 21",
        lenderRoom: "Room 209",
        availabilityPeriod: "5th Oct - 20th Oct",
        price: "₹350",
        phone: "9812903456",
        email: "tarun.b@bitsindri.ac.in",
        tags: ["table", "study desk", "laptop table", "others"]
    },
    {
        id: "item-oth-003",
        name: "Bajaj Minor High-Speed Personal Desk Fan",
        category: "Others",
        shortDesc: "Quiet high-speed table fan with adjustable tilt head.",
        fullDesc: "Bajaj Minor 250mm desk fan with high air delivery, silent motor and wall mountable bracket.",
        image: "item_desk_fan.svg",
        lenderName: "Tarun Bajaj",
        lenderRoll: "21/MECH/062",
        lenderHostel: "Hostel No 21",
        lenderRoom: "Room 209",
        availabilityPeriod: "Available Always",
        price: "Free / Borrow",
        phone: "9812903456",
        email: "tarun.b@bitsindri.ac.in",
        tags: ["fan", "desk fan", "others"]
    },
    {
        id: "item-oth-004",
        name: "Yonex Badminton Racket Pair & Shuttles",
        category: "Others",
        shortDesc: "Pair of aluminum frame rackets with full carrying cover & shuttles.",
        fullDesc: "Yonex Muscle Power badminton racket pair with tight string tension, full zip case and box of 6 Mavis 350 shuttles.",
        image: "item_badminton_racket.svg",
        lenderName: "Ritu Rani",
        lenderRoll: "21/IT/058",
        lenderHostel: "Hostel No 13",
        lenderRoom: "Room 101",
        availabilityPeriod: "7th Oct - 22nd Oct",
        price: "₹500",
        phone: "9543126789",
        email: "ritu.r@bitsindri.ac.in",
        tags: ["badminton", "racket", "sports", "others"]
    },
    {
        id: "item-oth-005",
        name: "Anchor Surge Protector Extension Board",
        category: "Others",
        shortDesc: "2m heavy-duty copper extension cord with 4 sockets.",
        fullDesc: "Anchor 4-socket surge protection power strip with master switch, neon indicator light and 2m cable.",
        image: "item_extension_board.svg",
        lenderName: "Rahul Verma",
        lenderRoll: "21/IT/042",
        lenderHostel: "Hostel No 24",
        lenderRoom: "Room 203",
        availabilityPeriod: "Available Always",
        price: "₹200",
        phone: "9437543796",
        email: "rahul.v@bitsindri.ac.in",
        tags: ["extension board", "power strip", "anchor", "others"]
    },
    {
        id: "item-oth-006",
        name: "Givson Acoustic Guitar with Padded Bag",
        category: "Others",
        shortDesc: "41-inch acoustic wooden guitar with belt, plectrums & bag.",
        fullDesc: "Givson Bluebird 41-inch steel-string acoustic guitar with neck allen key, plectrums, shoulder strap and waterproof padded bag.",
        image: "item_guitar.svg",
        lenderName: "Ananya Roy",
        lenderRoll: "23/CHE/009",
        lenderHostel: "Hostel No 11",
        lenderRoom: "Room 304",
        availabilityPeriod: "10th Oct - 30th Oct",
        price: "Free / Borrow",
        phone: "9456781234",
        email: "ananya.r@bitsindri.ac.in",
        tags: ["guitar", "music", "instrument", "others"]
    }
];

// Active Item in Detail Modal
let currentActiveItemId = null;
let activeCategoryFilter = "all";

// Live items cache
let liveMarketplaceItems = [...MARKETPLACE_DATABASE];

// ----------------------------------------------------------------------------
// 2. INITIALIZATION
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    initUserSession();
    initBannerSlider();
    await loadMarketplaceItemsFromDB();
    initCarouselAutoMovement();
});

async function loadMarketplaceItemsFromDB() {
    if (typeof DatabaseService !== 'undefined') {
        const dbItems = await DatabaseService.getMarketplaceItems();
        if (dbItems && dbItems.length > 0) {
            // Map Supabase DB items to marketplace format
            const mapped = dbItems.map(item => {
                const staticMatch = MARKETPLACE_DATABASE.find(s => s.name.toLowerCase() === item.title.toLowerCase());
                return {
                    id: item.id,
                    name: item.title,
                    category: item.category,
                    shortDesc: item.description ? (item.description.length > 75 ? item.description.substring(0, 75) + '...' : item.description) : 'Available for campus sharing',
                    fullDesc: item.description || 'Campus student resource.',
                    image: item.image_url || (staticMatch ? staticMatch.image : 'item_calculator.jpg'),
                    lenderName: item.seller_name || (staticMatch ? staticMatch.lenderName : 'Campus Student'),
                    lenderRoll: item.seller_roll || (staticMatch ? staticMatch.lenderRoll : 'Student'),
                    lenderHostel: item.seller_hostel || (staticMatch ? staticMatch.lenderHostel : 'Hostel Campus'),
                    lenderRoom: staticMatch ? staticMatch.lenderRoom : 'Hostel Room',
                    availabilityPeriod: staticMatch ? staticMatch.availabilityPeriod : '5th Oct - 20th Oct',
                    price: item.price || (staticMatch ? staticMatch.price : 'Free / Borrow'),
                    phone: item.seller_phone || (staticMatch ? staticMatch.phone : '9437543796'),
                    email: staticMatch ? staticMatch.email : 'student@bitsindri.ac.in',
                    tags: [item.title.toLowerCase(), item.category.toLowerCase()]
                };
            });

            // Merge with static database (deduplicating by item title)
            const dbTitles = new Set(mapped.map(m => m.name.toLowerCase().trim()));
            liveMarketplaceItems = [...mapped, ...MARKETPLACE_DATABASE.filter(m => !dbTitles.has(m.name.toLowerCase().trim()))];
        }
    }
    renderMarketplaceCards();
}

// Sync User Profile info in Top Right Circle
async function initUserSession() {
    let user = null;
    try {
        const stored = localStorage.getItem('safeCampusUser');
        if (stored) user = JSON.parse(stored);
    } catch(e) {}

    if (user && user.roll && typeof DatabaseService !== 'undefined') {
        try {
            const dbProfile = await DatabaseService.getProfile(user.roll);
            if (!dbProfile) {
                localStorage.removeItem('safeCampusUser');
                localStorage.removeItem('safeCampusUserProfile');
                user = null;
            }
        } catch(e) {}
    }

    const circleBtn = document.getElementById('headerProfileCircle');
    const badge = document.getElementById('userInitialBadge');

    if (user && user.photo && circleBtn) {
        circleBtn.innerHTML = `<img src="${user.photo}" alt="${user.name ? user.name.replace(/"/g, '&quot;') : 'Profile'}" class="user-circle-avatar-img">`;
    } else if (badge) {
        if (user && user.name) {
            badge.innerText = user.name.charAt(0).toUpperCase();
        } else {
            badge.innerText = 'G'; // Default wireframe profile badge 'G'
        }
    }
}

// Navigation back to previous page
function goBackToHome() {
    window.location.href = 'index.html';
}

function handleProfileClick() {
    window.location.href = 'profile.html';
}

// ----------------------------------------------------------------------------
// 3. TOP BANNER SLIDER CONTROLLER
// ----------------------------------------------------------------------------
let currentSlideIndex = 0;
let slideInterval = null;

function initBannerSlider() {
    const slides = document.querySelectorAll('.slider-slide');
    if (!slides.length) return;

    startSlideAutoTimer();

    // Pause on hover
    const sliderElem = document.getElementById('marketplaceSlider');
    if (sliderElem) {
        sliderElem.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderElem.addEventListener('mouseleave', () => startSlideAutoTimer());
    }
}

function startSlideAutoTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        nextSlide();
    }, 2000);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dots .dot-btn');
    
    if (index >= slides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = index;

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlideIndex);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlideIndex);
    });
}

function nextSlide() {
    showSlide(currentSlideIndex + 1);
}

function prevSlide() {
    showSlide(currentSlideIndex - 1);
}

function goToSlide(index) {
    showSlide(index);
    startSlideAutoTimer();
}

// ----------------------------------------------------------------------------
// 4. MARKETPLACE CARDS RENDERING & CAROUSEL
// ----------------------------------------------------------------------------
function getRequestedItems() {
    try {
        const reqs = localStorage.getItem('safeCampusRequestedItems');
        return reqs ? JSON.parse(reqs) : [];
    } catch(e) {
        return [];
    }
}

function saveRequestedItems(reqArray) {
    localStorage.setItem('safeCampusRequestedItems', JSON.stringify(reqArray));
}

// Carousel Animation State Variables
let carouselAnimationId = null;
let currentOffset = 0;
let targetOffset = 0;
let isManualNavigating = false;
let isCarouselPaused = false;
let singleSetWidth = 0;
let singleCardPitch = 318;
let currentItemCount = 0;

function renderMarketplaceCards() {
    const track = document.getElementById('itemsCarouselTrack');
    if (!track) return;

    const requestedList = getRequestedItems();
    
    let filtered = liveMarketplaceItems;
    if (activeCategoryFilter !== 'all') {
        filtered = liveMarketplaceItems.filter(item => item.category.toLowerCase().includes(activeCategoryFilter.toLowerCase()));
    }

    if (filtered.length === 0) {
        track.innerHTML = `
            <div style="padding: 2rem; color: #94a3b8; font-size: 1.1rem; text-align: center; width: 100%;">
                No available items found in category "${activeCategoryFilter}". Try selecting "All Items".
            </div>
        `;
        singleSetWidth = 0;
        return;
    }

    currentItemCount = filtered.length;

    // Helper to generate HTML for one card
    const cardHTML = (item, index) => {
        const isReq = requestedList.includes(item.id);
        const itemPrice = (item.price || '').trim();
        const isFree = !itemPrice || itemPrice.toLowerCase().includes('free') || itemPrice.toLowerCase().includes('borrow');
        const priceLabel = isFree ? '🎁 Free to Borrow' : `🏷️ ${escapeHTML(itemPrice)}`;
        const priceClass = isFree ? 'price-free' : 'price-paid';

        return `
            <div class="item-card" data-id="${item.id}" data-idx="${index}">
                <div class="item-card-image-wrap">
                    <img src="${item.image}" alt="${escapeHTML(item.name)}" class="item-card-img" onerror="this.src='banner_gadgets.jpg'">
                    <span class="item-card-badge">${escapeHTML(item.category)}</span>
                    <span class="item-card-status ${isReq ? 'requested' : ''}">${isReq ? 'Requested' : 'Available'}</span>
                    <span class="item-card-price-badge ${priceClass}">${priceLabel}</span>
                </div>
                
                <div class="item-card-body">
                    <h3 class="item-card-title" title="${escapeHTML(item.name)}">${escapeHTML(item.name)}</h3>
                    <p class="item-card-desc">${escapeHTML(item.shortDesc)}</p>
                    
                    <div class="item-card-meta">
                        <span class="item-lender-loc">📍 ${escapeHTML(item.lenderHostel)}</span>
                        <span>🗓️ ${escapeHTML(item.availabilityPeriod)}</span>
                    </div>
                </div>

                <div class="item-card-footer">
                    <button class="btn-see-details" onclick="openItemDetails('${item.id}')">
                        SEE DETAILS
                    </button>
                </div>
            </div>
        `;
    };

    // Render 3 identical sets to ensure infinite seamless circular loop
    const loopItems = [...filtered, ...filtered, ...filtered];
    track.innerHTML = loopItems.map((it, idx) => cardHTML(it, idx)).join('');

    // Measure exact geometric set width
    setTimeout(measureSetGeometry, 60);
}

function measureSetGeometry() {
    const track = document.getElementById('itemsCarouselTrack');
    if (!track || currentItemCount === 0) return;

    const cards = track.querySelectorAll('.item-card');
    if (cards.length > currentItemCount) {
        const firstCard = cards[0];
        const nextSetFirstCard = cards[currentItemCount];
        if (firstCard && nextSetFirstCard) {
            singleSetWidth = nextSetFirstCard.offsetLeft - firstCard.offsetLeft;
            singleCardPitch = singleSetWidth / currentItemCount;
            return;
        }
    }
    // Fallback: 290px card width + 28px gap = 318px
    singleCardPitch = 318;
    singleSetWidth = currentItemCount * singleCardPitch;
}

window.addEventListener('resize', () => {
    measureSetGeometry();
});

function filterItemsByCategory(category) {
    activeCategoryFilter = category;
    
    // Update chip buttons
    document.querySelectorAll('.filter-chip').forEach(chip => {
        const text = chip.innerText.toLowerCase();
        if (category === 'all' && text.includes('all')) {
            chip.classList.add('active');
        } else if (category !== 'all' && text.includes(category.toLowerCase().split(' ')[0])) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    currentOffset = 0;
    targetOffset = 0;
    renderMarketplaceCards();
    showToast(`Showing ${category === 'all' ? 'All' : category} items`, 'info');
}

// Manual Carousel Navigation Buttons (< and >) - 100% responsive
function scrollCarousel(direction) {
    if (singleSetWidth <= 0) {
        measureSetGeometry();
    }

    const step = singleCardPitch > 0 ? singleCardPitch : 318;
    // direction: -1 for left (prev), +1 for right (next)
    targetOffset = currentOffset + (direction * step);
    isManualNavigating = true;
    isCarouselPaused = false;
}

// Continuous Infinite GPU-accelerated Carousel Movement (Rotating like carousel horses)
function initCarouselAutoMovement() {
    const wrapper = document.querySelector('.carousel-outer-wrapper');
    const track = document.getElementById('itemsCarouselTrack');
    if (!wrapper || !track) return;

    // Hover / Touch interaction listeners
    wrapper.addEventListener('mouseenter', () => { isCarouselPaused = true; });
    wrapper.addEventListener('mouseleave', () => { isCarouselPaused = false; });
    wrapper.addEventListener('touchstart', () => { isCarouselPaused = true; }, { passive: true });
    wrapper.addEventListener('touchend', () => { isCarouselPaused = false; }, { passive: true });

    const CRUISE_SPEED = 0.9; // Smooth continuous reading speed in px/frame

    function stepLoop() {
        if (singleSetWidth > 0) {
            if (isManualNavigating) {
                // Smooth ease-out interpolation when user clicks < or > arrow buttons
                const diff = targetOffset - currentOffset;
                if (Math.abs(diff) < 0.5) {
                    currentOffset = targetOffset;
                    isManualNavigating = false;
                } else {
                    currentOffset += diff * 0.14;
                }
            } else if (!isCarouselPaused) {
                // Normal continuous carousel cruise
                currentOffset += CRUISE_SPEED;
                targetOffset = currentOffset;
            }

            // Infinite seamless boundary wrapping (invisible to user)
            if (currentOffset >= singleSetWidth) {
                currentOffset -= singleSetWidth;
                targetOffset -= singleSetWidth;
            } else if (currentOffset < 0) {
                currentOffset += singleSetWidth;
                targetOffset += singleSetWidth;
            }

            // Apply hardware-accelerated 3D transform
            track.style.transform = `translate3d(-${currentOffset}px, 0, 0)`;
        }

        carouselAnimationId = requestAnimationFrame(stepLoop);
    }

    if (carouselAnimationId) cancelAnimationFrame(carouselAnimationId);
    carouselAnimationId = requestAnimationFrame(stepLoop);
}

// ----------------------------------------------------------------------------
// 5. SEARCH BAR LOGIC & REDIRECTION
// ----------------------------------------------------------------------------
function handleSearchKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        triggerSearch();
    }
}

function triggerSearch() {
    const input = document.getElementById('marketplaceSearchInput');
    if (!input) return;
    const query = input.value.trim();

    if (!query) {
        showToast('Please type an item name to search...', 'info');
        return;
    }

    // Filter cards immediately for user convenience
    const matches = MARKETPLACE_DATABASE.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.shortDesc.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    showToast(`Searching for "${query}"... Redirecting to results`, 'success');

    setTimeout(() => {
        // Redirect to search results page as required
        const targetUrl = `search_results.html?q=${encodeURIComponent(query)}`;
        // For demonstration, also dynamically filter if user stays or cancels
        console.log(`Redirecting to: ${targetUrl}`);
        window.location.href = targetUrl;
    }, 600);
}

// ----------------------------------------------------------------------------
// 6. FRAME 12 ITEM DETAILS POPUP MODAL
// ----------------------------------------------------------------------------
function openItemDetails(itemId) {
    const item = liveMarketplaceItems.find(it => it.id === itemId) || MARKETPLACE_DATABASE.find(it => it.id === itemId);
    if (!item) return;

    currentActiveItemId = itemId;
    const requestedList = getRequestedItems();
    const isRequested = requestedList.includes(itemId);

    // Populate modal fields matching Frame 12 layout
    const imgElem = document.getElementById('detailItemImage');
    if (imgElem) {
        imgElem.src = item.image;
        imgElem.onerror = () => { imgElem.src = 'banner_gadgets.jpg'; };
    }

    document.getElementById('detailItemCategory').innerText = item.category;
    document.getElementById('detailItemName').innerText = item.name;
    document.getElementById('detailItemDesc').innerText = item.fullDesc;
    document.getElementById('detailLenderName').innerText = item.lenderName;
    document.getElementById('detailLocation').innerText = `${item.lenderRoom}, ${item.lenderHostel}`;
    document.getElementById('detailAvailability').innerText = item.availabilityPeriod;
    document.getElementById('detailPhone').innerText = item.phone;
    document.getElementById('detailEmail').innerText = item.email;

    // Update Request Button state
    updateRequestButtonUI(isRequested);

    // Show modal
    const modal = document.getElementById('itemDetailsModal');
    if (modal) modal.classList.add('active');
}

function updateRequestButtonUI(isRequested) {
    const btn = document.getElementById('btnRequestItem');
    const textSpan = document.getElementById('requestBtnText');

    if (isRequested) {
        btn.classList.add('active-requested');
        textSpan.innerText = 'Cancel Request';
    } else {
        btn.classList.remove('active-requested');
        textSpan.innerText = 'Request Item';
    }
}

function toggleItemRequest() {
    if (!currentActiveItemId) return;

    let requestedList = getRequestedItems();
    const isRequested = requestedList.includes(currentActiveItemId);
    const item = MARKETPLACE_DATABASE.find(it => it.id === currentActiveItemId);

    if (isRequested) {
        // Cancel Request
        requestedList = requestedList.filter(id => id !== currentActiveItemId);
        saveRequestedItems(requestedList);
        updateRequestButtonUI(false);
        showToast(`Request for "${item ? item.name : 'item'}" cancelled.`, 'info');
    } else {
        // Submit Request
        requestedList.push(currentActiveItemId);
        saveRequestedItems(requestedList);
        updateRequestButtonUI(true);
        showToast(`✓ Request submitted to ${item ? item.lenderName : 'lender'}! Check contact details.`, 'success');
    }

    renderMarketplaceCards();
}

function closeItemDetailsModal() {
    const modal = document.getElementById('itemDetailsModal');
    if (modal) modal.classList.remove('active');
    currentActiveItemId = null;
}

function openLenderProfile() {
    if (!currentActiveItemId) return;
    const item = liveMarketplaceItems.find(it => it.id === currentActiveItemId) || MARKETPLACE_DATABASE.find(it => it.id === currentActiveItemId);
    if (item && item.lenderName) {
        window.location.href = `seller_profile.html?item=${encodeURIComponent(item.id)}&seller=${encodeURIComponent(item.lenderName)}`;
    } else {
        window.location.href = 'seller_profile.html';
    }
}

function copyText(elementId) {
    const text = document.getElementById(elementId)?.innerText;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied ${text} to clipboard!`, 'success');
        }).catch(() => {
            showToast(`Selected: ${text}`, 'info');
        });
    }
}

// ----------------------------------------------------------------------------
// 7. FRAME 17 "TALK WITH AI" CHAT ASSISTANT
// ----------------------------------------------------------------------------
function toggleAIChatModal() {
    const chatModal = document.getElementById('aiChatModal');
    if (!chatModal) return;

    chatModal.classList.toggle('active');
    if (chatModal.classList.contains('active')) {
        setTimeout(() => {
            document.getElementById('aiChatInput')?.focus();
        }, 150);
    }
}

function handleAIChatKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendAIChatMessage();
    }
}

function sendAIChatMessage() {
    const input = document.getElementById('aiChatInput');
    const msgContainer = document.getElementById('aiChatMessages');
    if (!input || !msgContainer) return;

    const query = input.value.trim();
    if (!query) return;

    // 1. Append User Message
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chat-message user-message';
    userMsgDiv.innerHTML = `
        <div class="chat-bubble user-bubble">${escapeHTML(query)}</div>
        <span class="chat-timestamp">${getCurrentTimeStr()}</span>
    `;
    msgContainer.appendChild(userMsgDiv);
    input.value = '';
    msgContainer.scrollTop = msgContainer.scrollHeight;

    // 2. Process AI Fuzzy Response
    setTimeout(() => {
        generateAIResponse(query, msgContainer);
    }, 600);
}

// Marketplace Chat Conversation History for Groq
let marketplaceChatHistory = [];

async function generateAIResponse(query, msgContainer) {
    // Show typing indicator
    const typingId = `typing-${Date.now()}`;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai-message';
    typingDiv.id = typingId;
    typingDiv.innerHTML = `
        <div class="chat-bubble ai-bubble" style="font-style: italic; color: #94a3b8;">
            🔍 Searching campus inventory...
        </div>
    `;
    msgContainer.appendChild(typingDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;

    let aiResult = null;
    if (typeof queryMarketplaceAI !== 'undefined') {
        aiResult = await queryMarketplaceAI(query, marketplaceChatHistory);
    } else {
        aiResult = {
            text: "Hello! Try asking for items like scientific calculators, engineering drafters, lab coats, or textbooks.",
            items: []
        };
    }

    // Remove typing indicator
    document.getElementById(typingId)?.remove();

    // Track history
    marketplaceChatHistory.push({ role: "user", content: query });
    marketplaceChatHistory.push({ role: "assistant", content: aiResult.text });

    // Render item cards if returned
    let itemsHTML = "";
    if (aiResult.items && aiResult.items.length > 0) {
        itemsHTML = `
            <div class="ai-chat-items-list" style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;">
                ${aiResult.items.map(item => `
                    <div class="ai-item-mini-card" style="background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 10px; padding: 0.65rem 0.85rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.65rem;">
                            <img src="${item.image_url || 'item_calculator.jpg'}" alt="${escapeHTML(item.title)}" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover; border: 1px solid rgba(0,240,255,0.3);" onerror="this.src='item_calculator.jpg'">
                            <div style="display: flex; flex-direction: column;">
                                <span style="font-weight: bold; color: #ffffff; font-size: 0.85rem;">${escapeHTML(item.title)}</span>
                                <span style="color: #00f0ff; font-size: 0.78rem; font-weight: 600;">${escapeHTML(item.price || 'Free / Borrow')} • 📍 ${escapeHTML(item.hostel || 'Campus')}</span>
                            </div>
                        </div>
                        <button class="ai-mini-view-btn" onclick="openItemDetails('${item.id}')" style="background: #00f0ff; color: #070a12; border: none; padding: 0.35rem 0.75rem; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer; white-space: nowrap;">
                            View Item ➔
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    const aiMsgDiv = document.createElement('div');
    aiMsgDiv.className = 'chat-message ai-message';
    aiMsgDiv.innerHTML = `
        <div class="chat-bubble ai-bubble">
            <p style="margin: 0; line-height: 1.45;">${escapeHTML(aiResult.text).replace(/\n/g, '<br>')}</p>
            ${itemsHTML}
        </div>
        <span class="chat-timestamp">${getCurrentTimeStr()}</span>
    `;
    msgContainer.appendChild(aiMsgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

function getCurrentTimeStr() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ----------------------------------------------------------------------------
// 8. UTILITIES & TOAST
// ----------------------------------------------------------------------------
function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    toast.innerText = msg;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
