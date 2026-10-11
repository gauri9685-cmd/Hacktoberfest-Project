/**
 * ============================================================================
 * SAFECAMPUS CONNECT V2 — SELLER / LENDER PUBLIC PROFILE CONTROLLER
 * Reads seller/item from query params & renders verified lender information,
 * sharing track record history, and available inventory.
 * ============================================================================
 */

// Sellers / Lenders Database Directory
const SELLERS_DIRECTORY = {
    "Rahul Verma": {
        name: "Rahul Verma",
        roll: "21/IT/042",
        branch: "Information Technology (IT)",
        year: "3rd Year (B.Tech)",
        hostel: "Hostel No 24",
        room: "Room 203",
        phone: "+91 9437543796",
        email: "rahul.v@bitsindri.ac.in",
        trustRating: "⭐ 4.9 Trust Rating (14 Borrows)",
        history: [
            { title: "Shared: Casio FX-991CW Calculator", meta: "Borrowed by Ananya Roy • Rated 5.0 ⭐", date: "Oct 2026", status: "Active" },
            { title: "Shared: Anchor Extension Board", meta: "Borrowed by Rohit Raj • Returned on time", date: "Sep 2026", status: "Returned" },
            { title: "Shared: Microprocessor 8085 Kit", meta: "Borrowed by Karan Mehta • Completed", date: "Aug 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-elec-001",
                name: "Casio FX-991CW Scientific Calculator",
                category: "Electronics",
                type: "free",
                shortDesc: "Non-programmable scientific calculator, essential for B.Tech semester exams.",
                fullDesc: "Casio FX-991CW Classwiz Non-Programmable Scientific Calculator, essential for Semester exams, Engineering Maths, and GATE prep.",
                image: "item_calculator.jpg",
                availability: "5th Oct - 20th Oct",
                location: "Room 203, Hostel No 24"
            },
            {
                id: "item-oth-005",
                name: "Anchor Surge Protector Extension Board",
                category: "Others",
                type: "free",
                shortDesc: "2m heavy-duty copper extension cord with 4 sockets.",
                fullDesc: "Anchor 4-socket surge protection power strip with master switch, neon indicator light and 2m cable.",
                image: "item_extension_board.svg",
                availability: "Available Always",
                location: "Room 203, Hostel No 24"
            }
        ]
    },
    "Priya Sharma": {
        name: "Priya Sharma",
        roll: "22/CHE/018",
        branch: "Chemical Engineering",
        year: "2nd Year (B.Tech)",
        hostel: "Hostel No 12",
        room: "Room 108",
        phone: "+91 9876543210",
        email: "priya.s@bitsindri.ac.in",
        trustRating: "⭐ 5.0 Trust Rating (8 Borrows)",
        history: [
            { title: "Shared: White Cotton Lab Coat", meta: "Borrowed by Rita Kumari • Returned on time", date: "Oct 2026", status: "Active" },
            { title: "Shared: 4-Tier Storage Rack", meta: "Borrowed by Pooja Verma • Completed", date: "Sep 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-lab-001",
                name: "White Cotton Lab Coat (Size M)",
                category: "Lab & Engineering",
                type: "free",
                shortDesc: "Clean Size M lab coat for Chemistry & Physics practicals.",
                fullDesc: "Pure cotton white laboratory apron coat (Size Medium) with front buttons and deep pen pockets.",
                image: "lab_coat.jpg",
                availability: "6th Oct - 14th Oct",
                location: "Room 108, Hostel No 12"
            },
            {
                id: "item-mob-005",
                name: "Campus Foldable 4-Tier Storage Rack",
                category: "Mobility",
                type: "free",
                shortDesc: "Multipurpose shoe & book organizer rack for hostel rooms.",
                fullDesc: "Foldable 4-tier steel & fabric storage rack, easy to assemble and perfect for keeping shoes and books organized.",
                image: "item_storage_rack.svg",
                availability: "6th Oct - 25th Oct",
                location: "Room 108, Hostel No 12"
            }
        ]
    },
    "Aman Singh": {
        name: "Aman Singh",
        roll: "21/CSE/055",
        branch: "Computer Science & Engineering",
        year: "3rd Year (B.Tech)",
        hostel: "Hostel No 19",
        room: "Room 312",
        phone: "+91 9123456780",
        email: "aman.s@bitsindri.ac.in",
        trustRating: "⭐ 4.8 Trust Rating (11 Borrows)",
        history: [
            { title: "Shared: SanDisk 64GB USB 3.0 Pen Drive", meta: "Semester materials loaded • Completed", date: "Sep 2026", status: "Returned" },
            { title: "Shared: CLRS Introduction to Algorithms", meta: "Borrowed by Vikas Kumar • Completed", date: "Aug 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-elec-002",
                name: "SanDisk 64GB USB 3.0 Pen Drive",
                category: "Electronics",
                type: "free",
                shortDesc: "High-speed flash drive loaded with semester notes & past papers.",
                fullDesc: "Pre-loaded with previous 5 years semester question papers, reference PDFs and lecture recordings.",
                image: "pen drive.jpg",
                availability: "Available Always",
                location: "Room 312, Hostel No 19"
            },
            {
                id: "item-book-001",
                name: "CLRS Introduction to Algorithms (4th Ed)",
                category: "Books",
                type: "free",
                shortDesc: "Standard algorithms textbook with annotated notes & solutions.",
                fullDesc: "Introduction to Algorithms (CLRS 4th Edition) hardbound copy with handwritten notes on graph algorithms.",
                image: "clrs bk.jpg",
                availability: "Available Always",
                location: "Room 312, Hostel No 19"
            }
        ]
    },
    "Vikash Kumar": {
        name: "Vikash Kumar",
        roll: "22/MECH/089",
        branch: "Mechanical Engineering",
        year: "2nd Year (B.Tech)",
        hostel: "Hostel No 16",
        room: "Room 405",
        phone: "+91 9988776655",
        email: "vikash.k@bitsindri.ac.in",
        trustRating: "⭐ 4.9 Trust Rating (9 Borrows)",
        history: [
            { title: "Shared: Omega Precision Mini Drafter", meta: "Borrowed by Rita Kumari • Returned on time", date: "Sep 2026", status: "Returned" },
            { title: "Shared: Thermodynamics by P.K. Nag", meta: "Borrowed by Rishi Raj • Completed", date: "Aug 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-lab-002",
                name: "Omega Engineering Mini Drafter & Board",
                category: "Lab & Engineering",
                type: "free",
                shortDesc: "Precision mini drafter clamp with steel scales for Engineering Graphics.",
                fullDesc: "Omega precision engineering graphics mini drafter with dual scales, heavy clamp and sheet clips.",
                image: "mini_drafter.jpg",
                availability: "7th Oct - 20th Oct",
                location: "Room 405, Hostel No 16"
            },
            {
                id: "item-book-004",
                name: "Engineering Thermodynamics (P.K. Nag)",
                category: "Books",
                type: "free",
                shortDesc: "Standard Mechanical textbook with property tables & steam chart.",
                fullDesc: "Engineering Thermodynamics by P.K. Nag with steam tables booklet and solved numerical problems.",
                image: "item_thermo_book.jpg",
                availability: "8th Oct - 20th Oct",
                location: "Room 405, Hostel No 16"
            }
        ]
    },
    "Rohan Gupta": {
        name: "Rohan Gupta",
        roll: "20/ECE/031",
        branch: "Electronics & Communication Engineering",
        year: "4th Year (B.Tech)",
        hostel: "Hostel No 22",
        room: "Room 114",
        phone: "+91 9845123456",
        email: "rohan.g@bitsindri.ac.in",
        trustRating: "⭐ 4.9 Trust Rating (16 Borrows)",
        history: [
            { title: "Shared: Hero Sprint Mountain Bike", meta: "Campus transit • Returned on time", date: "Oct 2026", status: "Active" },
            { title: "Shared: Sadiku Electric Circuits Book", meta: "Borrowed by Ankit Das • Completed", date: "Sep 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-mob-001",
                name: "Hero Sprint 26T 21-Speed Gear Bicycle",
                category: "Mobility",
                type: "free",
                shortDesc: "Smooth campus commuter bike for quick transit between departments.",
                fullDesc: "Hero Sprint 26T 21-speed mountain bicycle with front suspension, mudguards and combination lock.",
                image: "bicycle.jpg",
                availability: "Available Always",
                location: "Room 114, Hostel No 22"
            },
            {
                id: "item-mob-003",
                name: "Heavy Duty Steel Bicycle Cable Lock",
                category: "Mobility",
                type: "free",
                shortDesc: "12mm thick braided steel cable lock with 4-digit combination.",
                fullDesc: "Resilient 12mm steel cable lock with vinyl coating to prevent frame scratches and custom numeric code lock.",
                image: "item_bicycle_lock.svg",
                availability: "5th Oct - 20th Oct",
                location: "Room 114, Hostel No 22"
            },
            {
                id: "item-book-003",
                name: "Fundamentals of Electric Circuits (Sadiku)",
                category: "Books",
                type: "free",
                shortDesc: "5th Edition circuit theory textbook with solved GATE questions.",
                fullDesc: "Fundamentals of Electric Circuits by Charles K. Alexander & Matthew N.O. Sadiku (5th Edition).",
                image: "item_circuits_book.jpg",
                availability: "Available Always",
                location: "Room 114, Hostel No 22"
            }
        ]
    },
    "Sneha Kumari": {
        name: "Sneha Kumari",
        roll: "21/CSE/012",
        branch: "Computer Science & Engineering",
        year: "3rd Year (B.Tech)",
        hostel: "Hostel No 14",
        room: "Room 219",
        phone: "+91 9765432190",
        email: "sneha.k@bitsindri.ac.in",
        trustRating: "⭐ 5.0 Trust Rating (12 Borrows)",
        history: [
            { title: "Shared: Raspberry Pi 4 Kit", meta: "Borrowed by Rahul Verma • Completed", date: "Oct 2026", status: "Active" },
            { title: "Shared: Operating System Concepts (Silberschatz)", meta: "Borrowed by Tarun Bajaj • Completed", date: "Sep 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-elec-006",
                name: "Raspberry Pi 4 Model B (4GB RAM)",
                category: "Electronics",
                type: "free",
                shortDesc: "Single board computer with official case & 32GB MicroSD card.",
                fullDesc: "Raspberry Pi 4 (4GB RAM) with quad-core 1.5GHz CPU, dual 4K micro-HDMI outputs, and pre-installed OS.",
                image: "item_raspberry_pi.jpg",
                availability: "Available Always",
                location: "Room 219, Hostel No 14"
            },
            {
                id: "item-book-006",
                name: "Operating System Concepts (Silberschatz)",
                category: "Books",
                type: "free",
                shortDesc: "Standard OS textbook covering process sync & memory management.",
                fullDesc: "Operating System Concepts by Abraham Silberschatz (9th Edition) with chapters on Linux & Windows kernel architectures.",
                image: "item_os_book.svg",
                availability: "10th Oct - 28th Oct",
                location: "Room 219, Hostel No 14"
            }
        ]
    },
    "Ankit Das": {
        name: "Ankit Das",
        roll: "21/EEE/078",
        branch: "Electrical & Electronics Engineering",
        year: "3rd Year (B.Tech)",
        hostel: "Hostel No 20",
        room: "Room 102",
        phone: "+91 9543210987",
        email: "ankit.d@bitsindri.ac.in",
        trustRating: "⭐ 4.9 Trust Rating (10 Borrows)",
        history: [
            { title: "Shared: Arduino Uno IoT Starter Kit", meta: "Borrowed by Kunal Roy • Rated 5.0 ⭐", date: "Oct 2026", status: "Active" },
            { title: "Shared: Higher Engineering Mathematics (B.S. Grewal)", meta: "Returned on time", date: "Sep 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-elec-003",
                name: "Arduino Uno R3 IoT Starter Kit",
                category: "Electronics",
                type: "free",
                shortDesc: "Prototyping kit with breadboard, sensors, jumper wires & motor driver.",
                fullDesc: "Complete Arduino Uno R3 robotics & IoT experimental kit with ultrasonic sensors, servo motors, LCD display.",
                image: "item_arduino_kit.jpg",
                availability: "10th Oct - 25th Oct",
                location: "Room 102, Hostel No 20"
            },
            {
                id: "item-book-002",
                name: "Higher Engineering Mathematics (B.S. Grewal)",
                category: "Books",
                type: "free",
                shortDesc: "44th Edition B.S. Grewal for 1st & 2nd year B.Tech maths.",
                fullDesc: "Higher Engineering Mathematics by Dr. B.S. Grewal (44th Edition). Contains linear algebra, calculus & differential equations.",
                image: "item_maths_book.jpg",
                availability: "5th Oct - 25th Oct",
                location: "Room 102, Hostel No 20"
            },
            {
                id: "item-mob-006",
                name: "Firefox Bike LED Headlight & Horn",
                category: "Mobility",
                type: "free",
                shortDesc: "USB rechargeable 300 lumen front headlight with horn button.",
                fullDesc: "Waterproof USB rechargeable bicycle headlight with 3 light modes and 120dB electric horn for night safety.",
                image: "item_bike_light.svg",
                availability: "10th Oct - 30th Oct",
                location: "Room 102, Hostel No 20"
            }
        ]
    },
    "Saurabh Mehta": {
        name: "Saurabh Mehta",
        roll: "22/ECE/044",
        branch: "Electronics & Communication Engineering",
        year: "2nd Year (B.Tech)",
        hostel: "Hostel No 21",
        room: "Room 115",
        phone: "+91 9876543120",
        email: "saurabh.m@bitsindri.ac.in",
        trustRating: "⭐ 4.8 Trust Rating (7 Borrows)",
        history: [
            { title: "Shared: Logitech M220 Silent Mouse", meta: "Borrowed by Aman Singh • Active", date: "Oct 2026", status: "Active" },
            { title: "Shared: Sony Wireless Headphones", meta: "Borrowed by Sneha Kumari • Returned", date: "Sep 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-elec-004",
                name: "Logitech M220 Wireless Silent Mouse",
                category: "Electronics",
                type: "free",
                shortDesc: "Compact 2.4GHz wireless optical mouse with quiet click buttons.",
                fullDesc: "Logitech M220 silent mouse with 18-month battery life, smooth optical tracking and nano USB receiver.",
                image: "item_mouse.jpg",
                availability: "Available Always",
                location: "Room 115, Hostel No 21"
            },
            {
                id: "item-elec-005",
                name: "Sony WH-CH520 Wireless Headphones",
                category: "Electronics",
                type: "free",
                shortDesc: "On-ear Bluetooth headphones with 50-hour battery life.",
                fullDesc: "Sony wireless Bluetooth headphones with multipoint connection, high clarity microphone for online classes.",
                image: "item_headphones.jpg",
                availability: "6th Oct - 18th Oct",
                location: "Room 115, Hostel No 21"
            }
        ]
    },
    "Ananya Roy": {
        name: "Ananya Roy",
        roll: "23/CHE/009",
        branch: "Chemical Engineering",
        year: "1st Year (B.Tech)",
        hostel: "Hostel No 11",
        room: "Room 304",
        phone: "+91 9456781234",
        email: "ananya.r@bitsindri.ac.in",
        trustRating: "⭐ 4.9 Trust Rating (6 Borrows)",
        history: [
            { title: "Shared: Camlin Drawing Set", meta: "Borrowed by Deepak Raj • Returned on time", date: "Oct 2026", status: "Active" },
            { title: "Shared: Safety Goggles & Lab Apron", meta: "Completed", date: "Sep 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-lab-003",
                name: "Camlin Engineering Drawing Set & Scale",
                category: "Lab & Engineering",
                type: "free",
                shortDesc: "Set squares, protractor, compass, steel scale & sheet tube container.",
                fullDesc: "Complete Camlin engineering drawing instrument set with 30cm steel ruler and plastic sheet holder container.",
                image: "item_drawing_set.jpg",
                availability: "Available Always",
                location: "Room 304, Hostel No 11"
            },
            {
                id: "item-lab-004",
                name: "Safety Goggles & Chemistry Lab Apron",
                category: "Lab & Engineering",
                type: "free",
                shortDesc: "Anti-fog clear protective goggles & heat-resistant lab apron.",
                fullDesc: "Polycarbonate anti-fog protective eyewear and thick cotton apron coat for organic chemistry lab practicals.",
                image: "item_goggles.jpg",
                availability: "8th Oct - 22nd Oct",
                location: "Room 304, Hostel No 11"
            },
            {
                id: "item-oth-006",
                name: "Givson Acoustic Guitar with Padded Bag",
                category: "Others",
                type: "free",
                shortDesc: "41-inch acoustic wooden guitar with belt, plectrums & bag.",
                fullDesc: "Givson Bluebird 41-inch steel-string acoustic guitar with neck allen key, plectrums, shoulder strap and waterproof padded bag.",
                image: "item_guitar.svg",
                availability: "10th Oct - 30th Oct",
                location: "Room 304, Hostel No 11"
            }
        ]
    },
    "Tarun Bajaj": {
        name: "Tarun Bajaj",
        roll: "21/MECH/062",
        branch: "Mechanical Engineering",
        year: "3rd Year (B.Tech)",
        hostel: "Hostel No 21",
        room: "Room 209",
        phone: "+91 9812903456",
        email: "tarun.b@bitsindri.ac.in",
        trustRating: "⭐ 5.0 Trust Rating (15 Borrows)",
        history: [
            { title: "Shared: Electric Kettle (1.8L)", meta: "Borrowed by Kunal Roy • Active", date: "Oct 2026", status: "Active" },
            { title: "Shared: Study Table", meta: "Borrowed by Chandan Kumar • Returned on time", date: "Sep 2026", status: "Returned" },
            { title: "Shared: Bajaj Desk Fan", meta: "Completed", date: "Aug 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-oth-001",
                name: "Stainless Steel Electric Kettle (1.8L)",
                category: "Others",
                type: "free",
                shortDesc: "1500W rapid boiling electric kettle for instant noodles & tea.",
                fullDesc: "Stainless steel 1.8-liter electric kettle with automatic shut-off and dry boiling protection.",
                image: "item_kettle.jpg",
                availability: "Available Always",
                location: "Room 209, Hostel No 21"
            },
            {
                id: "item-oth-002",
                name: "Foldable Wooden Hostel Study Table",
                category: "Others",
                type: "free",
                shortDesc: "Bedside study desk table with tablet slot & cup holder.",
                fullDesc: "Ergonomic wooden laptop table with foldable metal legs, iPad/tablet groove holder and cup slot.",
                image: "item_table.jpg",
                availability: "5th Oct - 20th Oct",
                location: "Room 209, Hostel No 21"
            },
            {
                id: "item-oth-003",
                name: "Bajaj Minor High-Speed Personal Desk Fan",
                category: "Others",
                type: "free",
                shortDesc: "Quiet high-speed table fan with adjustable tilt head.",
                fullDesc: "Bajaj Minor 250mm desk fan with high air delivery, silent motor and wall mountable bracket.",
                image: "item_desk_fan.svg",
                availability: "Available Always",
                location: "Room 209, Hostel No 21"
            },
            {
                id: "item-lab-006",
                name: "Steel Toe Workshop Safety Shoes (Size 8)",
                category: "Lab & Engineering",
                type: "free",
                shortDesc: "Heavy-duty industrial safety shoes with steel toe cap for workshop.",
                fullDesc: "ISI marked leather workshop safety shoes with steel toe cap and oil-resistant anti-skid rubber soles.",
                image: "item_safety_shoes.jpg",
                availability: "10th Oct - 30th Oct",
                location: "Room 209, Hostel No 21"
            }
        ]
    },
    "Ritu Rani": {
        name: "Ritu Rani",
        roll: "21/IT/058",
        branch: "Information Technology (IT)",
        year: "3rd Year (B.Tech)",
        hostel: "Hostel No 13",
        room: "Room 101",
        phone: "+91 9543126789",
        email: "ritu.r@bitsindri.ac.in",
        trustRating: "⭐ 4.9 Trust Rating (8 Borrows)",
        history: [
            { title: "Shared: Forouzan Networking Book", meta: "Semester exam prep • Returned", date: "Oct 2026", status: "Active" },
            { title: "Shared: Yonex Badminton Rackets", meta: "Completed", date: "Sep 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-book-005",
                name: "Data Communications & Networking (Forouzan)",
                category: "Books",
                type: "free",
                shortDesc: "5th Edition Computer Networks textbook for IT/CSE.",
                fullDesc: "Data Communications and Networking by Behrouz A. Forouzan (5th Edition) covering OSI layers and TCP/IP protocol suite.",
                image: "item_networks_book.jpg",
                availability: "Available Always",
                location: "Room 101, Hostel No 13"
            },
            {
                id: "item-oth-004",
                name: "Yonex Badminton Racket Pair & Shuttles",
                category: "Others",
                type: "free",
                shortDesc: "Pair of aluminum frame rackets with full carrying cover & shuttles.",
                fullDesc: "Yonex Muscle Power badminton racket pair with tight string tension, full zip case and box of 6 Mavis 350 shuttles.",
                image: "item_badminton_racket.svg",
                availability: "7th Oct - 22nd Oct",
                location: "Room 101, Hostel No 13"
            }
        ]
    },
    "Manish Tiwari": {
        name: "Manish Tiwari",
        roll: "21/CIV/052",
        branch: "Civil Engineering",
        year: "3rd Year (B.Tech)",
        hostel: "Hostel No 23",
        room: "Room 106",
        phone: "+91 9845123987",
        email: "manish.t@bitsindri.ac.in",
        trustRating: "⭐ 4.8 Trust Rating (13 Borrows)",
        history: [
            { title: "Shared: Surveying Ranging Rod & Tape", meta: "Survey camp field work • Active", date: "Oct 2026", status: "Active" },
            { title: "Shared: Firefox Target Mountain Bike", meta: "Completed", date: "Sep 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-lab-005",
                name: "Surveying Ranging Rod & Measuring Tape",
                category: "Lab & Engineering",
                type: "free",
                shortDesc: "30m steel measuring tape and 2m collapsible ranging rod.",
                fullDesc: "Heavy-duty 30-meter fiberglass measuring tape and 2-meter dual band surveying ranging rod for Civil survey field.",
                image: "item_ranging_rod.jpg",
                availability: "5th Oct - 15th Oct",
                location: "Room 106, Hostel No 23"
            },
            {
                id: "item-mob-002",
                name: "Firefox Target 27.5T Mountain Bicycle",
                category: "Mobility",
                type: "free",
                shortDesc: "Lightweight alloy frame mountain bike with dual disc brakes.",
                fullDesc: "Firefox Target 27.5T mountain bike with 21 Shimano gears, dual disc brakes and ergonomic handlebar grips.",
                image: "bicycle.jpg",
                availability: "Available Always",
                location: "Room 106, Hostel No 23"
            },
            {
                id: "item-mob-004",
                name: "Waterproof Steel Hostel Storage Trunk",
                category: "Mobility",
                type: "free",
                shortDesc: "Large iron storage trunk with heavy brass padlock for semester break.",
                fullDesc: "Spacious galvanized iron luggage trunk with dual side handles and heavy brass lock for hostel room storage.",
                image: "item_storage_trunk.svg",
                availability: "Available Always",
                location: "Room 106, Hostel No 23"
            }
        ]
    }
};

let currentSeller = SELLERS_DIRECTORY["Rahul Verma"];
let currentActiveItem = null;

// ----------------------------------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    await initSellerDataFromURL();
    renderSellerProfile();
});

async function initSellerDataFromURL() {
    const params = new URLSearchParams(window.location.search);
    const sellerParam = params.get('seller');
    const itemParam = params.get('item');

    if (sellerParam) {
        const decoded = decodeURIComponent(sellerParam).trim();
        const matchKey = Object.keys(SELLERS_DIRECTORY).find(k => k.toLowerCase() === decoded.toLowerCase());
        if (matchKey) {
            currentSeller = SELLERS_DIRECTORY[matchKey];
        }
    } else if (itemParam) {
        // Find seller by item ID or name
        for (const [name, data] of Object.entries(SELLERS_DIRECTORY)) {
            if (data.items.some(it => it.id === itemParam || it.name.toLowerCase().includes(itemParam.toLowerCase()))) {
                currentSeller = data;
                break;
            }
        }
    }

    // Try finding additional items for this seller in Supabase
    if (sellerParam && typeof supabaseClient !== 'undefined' && supabaseClient) {
        try {
            const { data: dbItems } = await supabaseClient
                .from('marketplace_items')
                .select('*')
                .ilike('seller_name', `%${decodeURIComponent(sellerParam).trim()}%`);

            if (dbItems && dbItems.length > 0) {
                const first = dbItems[0];
                if (!currentSeller) {
                    currentSeller = {
                        name: first.seller_name,
                        roll: first.seller_roll || 'Student',
                        branch: 'Engineering (B.Tech)',
                        year: 'B.Tech Student',
                        hostel: first.seller_hostel || 'Hostel Campus',
                        room: 'Campus Room',
                        phone: first.seller_phone || '+91 9437543796',
                        email: 'student@bitsindri.ac.in',
                        trustRating: '⭐ 5.0 Verified Student (Verified Borrow)',
                        history: [
                            { title: `Listed: ${first.title}`, meta: 'Active Campus Listing', date: 'Oct 2026', status: 'Active' }
                        ],
                        items: []
                    };
                }
            }
        } catch(e) {}
    }

    // Sync header profile initial / photo
    let user = null;
    try {
        const stored = localStorage.getItem('safeCampusUser');
        if (stored) user = JSON.parse(stored);
    } catch(e) {}
    const circleBtn = document.querySelector('.header-profile-zone .profile-circle-btn');
    const badge = document.getElementById('userInitialBadge');
    if (user && user.photo && circleBtn) {
        circleBtn.innerHTML = `<img src="${user.photo}" alt="${user.name ? user.name.replace(/"/g, '&quot;') : 'Profile'}" class="user-circle-avatar-img">`;
    } else if (badge) {
        badge.innerText = (user && user.name) ? user.name.charAt(0).toUpperCase() : 'G';
    }
}

function renderSellerProfile() {
    // 1. Fill Profile Fields
    document.getElementById('displaySellerName').innerText = currentSeller.name;
    document.getElementById('displaySellerBranch').innerText = currentSeller.branch;
    document.getElementById('displaySellerYear').innerText = currentSeller.year;
    document.getElementById('displaySellerHostel').innerText = currentSeller.hostel;
    document.getElementById('displaySellerRoom').innerText = currentSeller.room;
    document.getElementById('displaySellerPhone').innerText = currentSeller.phone;
    document.getElementById('displaySellerEmail').innerText = currentSeller.email;

    const initial = currentSeller.name.charAt(0).toUpperCase();
    document.getElementById('sellerAvatarInitial').innerText = initial;

    // Contact CTA buttons
    const phoneClean = currentSeller.phone.replace(/[^0-9+]/g, '');
    document.getElementById('sellerCallBtn').href = `tel:${phoneClean}`;
    document.getElementById('sellerMailBtn').href = `mailto:${currentSeller.email}`;

    // 2. Render History Feed
    const historyFeed = document.getElementById('sellerHistoryFeedList');
    if (historyFeed) {
        historyFeed.innerHTML = currentSeller.history.map(entry => `
            <div class="history-entry-card type-shared">
                <div class="history-entry-main">
                    <span class="history-entry-title">${escapeHTML(entry.title)}</span>
                    <span class="history-entry-sub">${escapeHTML(entry.meta)} • <em>${escapeHTML(entry.date)}</em></span>
                </div>
                <span class="history-entry-badge status-active">${escapeHTML(entry.status)}</span>
            </div>
        `).join('');
    }

    // 3. Render Seller's Active Items
    document.getElementById('sellerItemsHeading').innerText = `Items Available from ${currentSeller.name}`;
    const itemsGrid = document.getElementById('sellerActiveItemsGrid');
    if (itemsGrid) {
        itemsGrid.innerHTML = currentSeller.items.map(item => `
            <div class="my-item-card" id="${item.id}">
                <div class="my-item-img-wrap">
                    <img src="${item.image}" alt="${escapeHTML(item.name)}" class="my-item-img" onerror="this.src='banner_gadgets.jpg'">
                    <span class="my-item-type-badge badge-free">FREE TO BORROW</span>
                </div>
                
                <div class="my-item-body">
                    <h3 class="my-item-title">${escapeHTML(item.name)}</h3>
                    <p class="my-item-desc">${escapeHTML(item.shortDesc)}</p>
                    
                    <div class="my-item-footer">
                        <span style="font-size: 0.78rem; color: #38bdf8;">📍 ${escapeHTML(item.location)}</span>
                        <button class="btn-see-details" style="padding: 0.4rem 0.85rem; font-size: 0.78rem; width: auto;" onclick="openItemDetails('${item.id}')">
                            SEE DETAILS
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// ----------------------------------------------------------------------------
// MODAL & ITEM REQUESTS
// ----------------------------------------------------------------------------
function openItemDetails(itemId) {
    const item = currentSeller.items.find(it => it.id === itemId) || currentSeller.items[0];
    if (!item) return;

    currentActiveItem = item;

    document.getElementById('detailItemImage').src = item.image;
    document.getElementById('detailItemCategory').innerText = item.category;
    document.getElementById('detailItemName').innerText = item.name;
    document.getElementById('detailItemDesc').innerText = item.fullDesc;
    document.getElementById('detailLenderName').innerText = currentSeller.name;
    document.getElementById('detailLocation').innerText = `${currentSeller.room}, ${currentSeller.hostel}`;
    document.getElementById('detailAvailability').innerText = item.availability;
    document.getElementById('detailPhone').innerText = currentSeller.phone;
    document.getElementById('detailEmail').innerText = currentSeller.email;

    const modal = document.getElementById('itemDetailsModal');
    if (modal) modal.classList.add('active');
}

function closeItemDetailsModal() {
    const modal = document.getElementById('itemDetailsModal');
    if (modal) modal.classList.remove('active');
    currentActiveItem = null;
}

function toggleItemRequest() {
    if (!currentActiveItem) return;
    const btn = document.getElementById('btnRequestItem');
    const textSpan = document.getElementById('requestBtnText');

    if (btn.classList.contains('active-requested')) {
        btn.classList.remove('active-requested');
        textSpan.innerText = 'Request Item';
        showToast(`Request cancelled for ${currentActiveItem.name}.`, 'info');
    } else {
        btn.classList.add('active-requested');
        textSpan.innerText = 'Cancel Request';
        showToast(`✓ Request sent directly to ${currentSeller.name}!`, 'success');
    }
}

function copyText(elementId) {
    const text = document.getElementById(elementId)?.innerText;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied ${text} to clipboard!`, 'success');
        });
    }
}

function goBack() {
    window.location.href = 'marketplace.html';
}

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
    return String(str).replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
