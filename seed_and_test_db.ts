import { db } from './server/db';

async function seed() {
  console.log("=== SEEDING DATABASE WITH INITIAL DATA ===");

  // 1. PROFILES
  console.log("Seeding profiles...");
  const defaultProfiles = [
    {
      id: 'a13698dc-ee1d-4d73-9302-b68e1df153cc',
      email: 'abhishek.gupta@sathaye.edu.in',
      full_name: 'Abhishek Gupta',
      role: 'student',
      department: 'Computer Science',
      phone_number: '+91 98201 44521',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    },
    {
      id: 'b24709ed-ff2e-5e84-0413-c79f2ef264dd',
      email: 'prakash.sharma@sathaye.edu.in',
      full_name: 'Dr. Prakash Sharma',
      role: 'faculty',
      department: 'Computer Science',
      phone_number: '+91 98202 55632',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
    },
    {
      id: 'c35810fe-003f-6f95-1524-d80a3fg375ee',
      email: 'admin.office@sathaye.edu.in',
      full_name: 'Campus Administrator',
      role: 'admin',
      department: 'Administration',
      phone_number: '+91 98200 11223',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250'
    },
    {
      id: 'd46921gf-114g-7g06-2635-e91b4gh486ff',
      email: 'library@sathaye.edu.in',
      full_name: 'Chief Librarian',
      role: 'library',
      department: 'Central Library',
      phone_number: '+91 98200 33445',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
    },
    {
      id: 'e57032hg-225h-8h17-3746-f02c5hi597gg',
      email: 'canteen@sathaye.edu.in',
      full_name: 'Central Canteen Manager',
      role: 'canteen',
      department: 'Campus Canteen',
      phone_number: '+91 98200 55667',
      avatar_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=250'
    }
  ];

  for (const p of defaultProfiles) {
    const { error } = await db.from('profiles').upsert(p, { onConflict: 'id' });
    if (error) console.log(`Profile error (${p.email}):`, error.message);
  }

  // 2. CANTEEN ITEMS
  console.log("Seeding canteen items...");
  const canteenItems = [
    {
      name: 'Masala Dosa',
      category: 'Breakfast',
      price: 60,
      description: 'Crispy rice crepe served with coconut chutney & hot sambar',
      is_available: true,
      image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500'
    },
    {
      name: 'Special Veg Thali',
      category: 'Lunch',
      price: 80,
      description: '2 Chapattis, Paneer Sabzi, Dal Tadka, Steamed Rice, Sweet & Salad',
      is_available: true,
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500'
    },
    {
      name: 'Cold Coffee with Ice Cream',
      category: 'Beverages',
      price: 45,
      description: 'Thick creamy blended cold coffee topped with vanilla scoop',
      is_available: true,
      image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500'
    },
    {
      name: 'Cheese Grilled Sandwich',
      category: 'Snacks',
      price: 50,
      description: 'Triple layer grilled sandwich packed with veggies & mozzarella cheese',
      is_available: true,
      image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500'
    },
    {
      name: 'Vada Pav (2 Pcs)',
      category: 'Snacks',
      price: 30,
      description: 'Mumbai style spicy potato fritters in soft pav with dry garlic chutney',
      is_available: true,
      image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500'
    }
  ];

  const { error: cntErr } = await db.from('canteen_items').upsert(canteenItems, { onConflict: 'name' });
  if (cntErr) console.log("Canteen items error:", cntErr.message);

  // 3. LIBRARY BOOKS
  console.log("Seeding library books...");
  const libraryBooks = [
    {
      isbn: '978-0131103627',
      title: 'The C Programming Language (2nd Edition)',
      author: 'Brian W. Kernighan & Dennis M. Ritchie',
      category: 'Computer Science',
      total_copies: 12,
      available_copies: 8,
      location_shelf: 'CS-Shelf-01'
    },
    {
      isbn: '978-0262033848',
      title: 'Introduction to Algorithms (CLRS)',
      author: 'Thomas H. Cormen et al.',
      category: 'Computer Science',
      total_copies: 10,
      available_copies: 5,
      location_shelf: 'CS-Shelf-03'
    },
    {
      isbn: '978-0136083207',
      title: 'Database System Concepts (6th Edition)',
      author: 'Abraham Silberschatz',
      category: 'Database Systems',
      total_copies: 8,
      available_copies: 4,
      location_shelf: 'DB-Shelf-02'
    },
    {
      isbn: '978-0735211292',
      title: 'Atomic Habits',
      author: 'James Clear',
      category: 'Self Improvement',
      total_copies: 15,
      available_copies: 9,
      location_shelf: 'GEN-Shelf-05'
    }
  ];

  const { error: libErr } = await db.from('library_books').upsert(libraryBooks, { onConflict: 'isbn' });
  if (libErr) console.log("Library books error:", libErr.message);

  console.log("Seeding complete!");
}

seed();
