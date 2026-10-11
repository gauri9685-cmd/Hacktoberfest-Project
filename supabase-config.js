/**
 * ============================================================================
 * SAFECAMPUS CONNECT V2 — SUPABASE CONFIGURATION & CLIENT SDK
 * Connected to Project: wbybesftdkubsqktezpy
 * ============================================================================
 */

const SUPABASE_URL = "https://wbybesftdkubsqktezpy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieWJlc2Z0ZGt1YnNxa3RlenB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MzIyMDQsImV4cCI6MjEwNzIwODIwNH0.FGkDJ1EezLnsi5XAiLmH6hWMWtXts68ui6rW0R_H8tE";

// Dynamically retrieve or initialize the Supabase Client
let supabaseClient = null;
function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("⚡ [SafeCampus] Supabase Client Initialized Successfully.");
        return supabaseClient;
    }
    return null;
}

// Initial attempt at load time
getSupabaseClient();

// ----------------------------------------------------------------------------
// DATABASE SERVICE HELPERS
// ----------------------------------------------------------------------------
const DatabaseService = {

    /**
     * Fetch all available marketplace items (or filtered by category / search query)
     */
    async getMarketplaceItems(category = 'all', searchQuery = '') {
        const client = getSupabaseClient();
        if (!client) return [];

        try {
            let query = client
                .from('marketplace_items')
                .select('*')
                .order('created_at', { ascending: false });

            if (category && category.toLowerCase() !== 'all') {
                query = query.ilike('category', `%${category}%`);
            }

            if (searchQuery && searchQuery.trim() !== '') {
                query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
            }

            const { data, error } = await query;
            if (error) {
                console.error("Error fetching marketplace items:", error);
                return [];
            }
            return data || [];
        } catch (e) {
            console.error("Exception fetching marketplace items:", e);
            return [];
        }
    },

    /**
     * Upload a new marketplace item and optional image to Supabase
     */
    async addMarketplaceItem(itemData, imageFile = null) {
        const client = getSupabaseClient();
        if (!client) return { success: false, error: "Database not connected" };

        try {
            let imageUrl = itemData.image_url || 'item_calculator.jpg';

            // Upload image to Storage if provided
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
                const filePath = `items/${fileName}`;

                const { data: uploadData, error: uploadError } = await client.storage
                    .from('marketplace-images')
                    .upload(filePath, imageFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (!uploadError && uploadData) {
                    const { data: urlData } = client.storage
                        .from('marketplace-images')
                        .getPublicUrl(filePath);
                    if (urlData && urlData.publicUrl) {
                        imageUrl = urlData.publicUrl;
                    }
                }
            }

            // Insert into marketplace_items table
            const { data, error } = await client
                .from('marketplace_items')
                .insert([{
                    title: itemData.title,
                    category: itemData.category || 'General',
                    description: itemData.description || '',
                    price: itemData.price || 'Free / Borrow',
                    condition: itemData.condition || 'Good',
                    status: 'available',
                    image_url: imageUrl,
                    seller_name: itemData.seller_name || 'Anonymous Student',
                    seller_phone: itemData.seller_phone || '',
                    seller_hostel: itemData.seller_hostel || 'Hostel Campus',
                    seller_roll: itemData.seller_roll || ''
                }])
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (err) {
            console.error("Error adding marketplace item:", err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Delete a Marketplace Item completely from Supabase Database
     */
    async deleteMarketplaceItem(itemId, itemTitle = '', sellerRoll = '') {
        const client = getSupabaseClient();
        if (!client) return { success: false, error: "Database not connected" };

        try {
            // 1. Delete by exact Supabase primary key ID if available
            if (itemId && !String(itemId).startsWith('upload-')) {
                const { error } = await client
                    .from('marketplace_items')
                    .delete()
                    .eq('id', itemId);

                if (!error) {
                    console.log(`⚡ [SafeCampus] Item deleted from Supabase by ID: ${itemId}`);
                    return { success: true };
                }
            }

            // 2. Fallback: match and delete by item title & optional seller_roll
            if (itemTitle) {
                let query = client.from('marketplace_items').delete().ilike('title', itemTitle.trim());
                if (sellerRoll) {
                    query = query.ilike('seller_roll', sellerRoll.trim());
                }
                const { error } = await query;
                if (error) throw error;
                console.log(`⚡ [SafeCampus] Item deleted from Supabase by Title: ${itemTitle}`);
            }

            return { success: true };
        } catch (err) {
            console.error("Error deleting marketplace item:", err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Fetch Emergency Contacts from Supabase
     */
    async getEmergencyContacts() {
        const client = getSupabaseClient();
        if (!client) return [];

        try {
            const { data, error } = await client
                .from('emergency_contacts')
                .select('*')
                .order('priority', { ascending: true });

            if (error) {
                console.error("Error fetching emergency contacts:", error);
                return [];
            }
            return data || [];
        } catch (e) {
            console.error("Exception in getEmergencyContacts:", e);
            return [];
        }
    },

    /**
     * Submit an Incident Report to Supabase
     */
    async submitIncident(incident) {
        const client = getSupabaseClient();
        if (!client) return { success: false, error: "Database not connected" };

        try {
            const refNo = `INC-${Date.now().toString().slice(-6)}`;
            const { data, error } = await client
                .from('incident_reports')
                .insert([{
                    reference_no: refNo,
                    category: incident.category,
                    location: incident.location,
                    details: incident.details,
                    has_gps: incident.has_gps ?? true,
                    is_anonymous: incident.is_anonymous ?? false,
                    status: 'pending'
                }])
                .select();

            if (error) throw error;
            return { success: true, refNo: refNo, data: data[0] };
        } catch (err) {
            console.error("Error submitting incident:", err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Save / Sync Student Profile
     */
    async saveProfile(profile) {
        const client = getSupabaseClient();
        if (!client) return { success: false };

        try {
            const { data, error } = await client
                .from('profiles')
                .upsert({
                    full_name: profile.name,
                    roll_number: profile.roll,
                    branch: profile.branch || 'Engineering',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    hostel: profile.hostel || '',
                    room_number: profile.room || '',
                    photo_url: profile.photo || ''
                }, { onConflict: 'roll_number' })
                .select();

            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (err) {
            console.error("Error saving profile:", err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Get Student Profile by Roll Number
     */
    async getProfile(rollNumber) {
        const client = getSupabaseClient();
        if (!client || !rollNumber) return null;

        try {
            const cleanRoll = rollNumber.trim();
            const { data, error } = await client
                .from('profiles')
                .select('*')
                .ilike('roll_number', cleanRoll)
                .maybeSingle();

            if (error) {
                console.error("[SafeCampus] getProfile query error:", error.message);
                return null;
            }

            return data || null;
        } catch (e) {
            console.error("Exception in getProfile:", e);
            return null;
        }
    },

    /**
     * Get Student Profile by Email Address
     */
    async getProfileByEmail(email) {
        const client = getSupabaseClient();
        if (!client || !email) return null;

        try {
            const cleanEmail = email.trim();
            const { data, error } = await client
                .from('profiles')
                .select('*')
                .ilike('email', cleanEmail)
                .maybeSingle();

            if (error) {
                console.error("[SafeCampus] getProfileByEmail query error:", error.message);
                return null;
            }

            return data || null;
        } catch (e) {
            console.error("Exception in getProfileByEmail:", e);
            return null;
        }
    },

    /**
     * Supabase Auth: Sign Up with Email and Password
     */
    async signUpWithEmail(email, password, metadata = {}) {
        const client = getSupabaseClient();
        if (!client) return { error: { message: "Database not connected" } };

        try {
            const { data, error } = await client.auth.signUp({
                email: email.trim(),
                password: password,
                options: {
                    data: metadata
                }
            });
            return { data, error };
        } catch (e) {
            return { error: e };
        }
    },

    /**
     * Supabase Auth: Sign In with Email and Password
     */
    async signInWithEmail(email, password) {
        const client = getSupabaseClient();
        if (!client) return { error: { message: "Database not connected" } };

        try {
            const { data, error } = await client.auth.signInWithPassword({
                email: email.trim(),
                password: password
            });
            return { data, error };
        } catch (e) {
            return { error: e };
        }
    },

    /**
     * Supabase Auth: Sign Out
     */
    async signOut() {
        const client = getSupabaseClient();
        if (client) {
            try {
                await client.auth.signOut();
            } catch(e) {}
        }
    },

    /**
     * Delete Student Profile & Associated Data
     */
    async deleteProfileAndAccount(email, rollNumber = '') {
        const client = getSupabaseClient();
        if (!client) return { success: false, error: "Database not connected" };

        try {
            // 1. Delete from profiles table by email
            if (email) {
                await client
                    .from('profiles')
                    .delete()
                    .ilike('email', email.trim());
            }

            // 2. Also delete by roll number if provided
            if (rollNumber) {
                await client
                    .from('profiles')
                    .delete()
                    .ilike('roll_number', rollNumber.trim());
            }

            // 3. Remove user's listed items if any
            if (email || rollNumber) {
                let itemsQuery = client.from('marketplace_items').delete();
                if (rollNumber) {
                    itemsQuery = itemsQuery.ilike('seller_roll', rollNumber.trim());
                }
                await itemsQuery;
            }

            // 4. Sign out from Supabase Auth
            await client.auth.signOut();

            return { success: true };
        } catch(err) {
            console.error("Error deleting account:", err);
            return { success: false, error: err.message };
        }
    }
};
