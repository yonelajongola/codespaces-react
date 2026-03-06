require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

const seedEmployees = [
  {
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@restaurant.com',
    phone: '+1234567801',
    jobTitle: 'Restaurant Manager',
    department: 'Management',
    shift: 'Full Day',
    salary: 5000,
    paymentType: 'monthly',
    hireDate: new Date('2025-01-15'),
    dateOfBirth: new Date('1985-03-10'),
    address: {
      street: '123 Oak Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Michael Williams',
      relationship: 'Spouse',
      phone: '+1234567802'
    },
    performance: {
      rating: 4.8,
      ordersCompleted: 0,
      customerRatings: 4.9,
      punctuality: 98,
      lastReviewDate: new Date('2026-03-01')
    },
    schedule: [
      { day: 'Monday', startTime: '08:00', endTime: '18:00' },
      { day: 'Tuesday', startTime: '08:00', endTime: '18:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '18:00' },
      { day: 'Thursday', startTime: '08:00', endTime: '18:00' },
      { day: 'Friday', startTime: '08:00', endTime: '18:00' }
    ],
    status: 'active',
    notes: 'Excellent leadership and organizational skills'
  },
  {
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@restaurant.com',
    phone: '+1234567803',
    jobTitle: 'Head Chef',
    department: 'Kitchen',
    shift: 'Full Day',
    salary: 4500,
    paymentType: 'monthly',
    hireDate: new Date('2025-02-01'),
    dateOfBirth: new Date('1982-07-22'),
    address: {
      street: '456 Maple Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Carlos Garcia',
      relationship: 'Brother',
      phone: '+1234567804'
    },
    performance: {
      rating: 5.0,
      ordersCompleted: 3500,
      customerRatings: 4.9,
      punctuality: 100,
      lastReviewDate: new Date('2026-03-01')
    },
    schedule: [
      { day: 'Monday', startTime: '10:00', endTime: '20:00' },
      { day: 'Tuesday', startTime: '10:00', endTime: '20:00' },
      { day: 'Wednesday', startTime: '10:00', endTime: '20:00' },
      { day: 'Thursday', startTime: '10:00', endTime: '20:00' },
      { day: 'Friday', startTime: '10:00', endTime: '22:00' },
      { day: 'Saturday', startTime: '10:00', endTime: '22:00' }
    ],
    status: 'active',
    notes: 'Award-winning chef with 15 years of experience'
  },
  {
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@restaurant.com',
    phone: '+1234567805',
    jobTitle: 'Line Cook',
    department: 'Kitchen',
    shift: 'Morning',
    hourlyRate: 18.00,
    paymentType: 'hourly',
    hireDate: new Date('2025-03-15'),
    dateOfBirth: new Date('1995-11-05'),
    address: {
      street: '789 Pine Road',
      city: 'New York',
      state: 'NY',
      zipCode: '10003',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Lisa Chen',
      relationship: 'Mother',
      phone: '+1234567806'
    },
    performance: {
      rating: 4.5,
      ordersCompleted: 2800,
      customerRatings: 4.6,
      punctuality: 95,
      lastReviewDate: new Date('2026-02-15')
    },
    schedule: [
      { day: 'Monday', startTime: '06:00', endTime: '14:00' },
      { day: 'Tuesday', startTime: '06:00', endTime: '14:00' },
      { day: 'Wednesday', startTime: '06:00', endTime: '14:00' },
      { day: 'Thursday', startTime: '06:00', endTime: '14:00' },
      { day: 'Friday', startTime: '06:00', endTime: '14:00' }
    ],
    status: 'active',
    notes: 'Fast and efficient, great knife skills'
  },
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@restaurant.com',
    phone: '+1234567807',
    jobTitle: 'Waiter',
    department: 'Front of House',
    shift: 'Morning',
    hourlyRate: 15.00,
    paymentType: 'hourly',
    hireDate: new Date('2025-04-01'),
    dateOfBirth: new Date('1998-05-20'),
    address: {
      street: '321 Elm Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10004',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Sister',
      phone: '+1234567808'
    },
    performance: {
      rating: 4.7,
      ordersCompleted: 1250,
      customerRatings: 4.8,
      punctuality: 92,
      lastReviewDate: new Date('2026-02-20')
    },
    schedule: [
      { day: 'Monday', startTime: '08:00', endTime: '16:00' },
      { day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Thursday', startTime: '08:00', endTime: '16:00' },
      { day: 'Friday', startTime: '08:00', endTime: '16:00' }
    ],
    status: 'active',
    notes: 'Excellent customer service skills, friendly demeanor'
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@restaurant.com',
    phone: '+1234567809',
    jobTitle: 'Host',
    department: 'Front of House',
    shift: 'Afternoon',
    hourlyRate: 14.00,
    paymentType: 'hourly',
    hireDate: new Date('2025-05-10'),
    dateOfBirth: new Date('2000-08-15'),
    address: {
      street: '654 Birch Lane',
      city: 'New York',
      state: 'NY',
      zipCode: '10005',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Rosa Rodriguez',
      relationship: 'Mother',
      phone: '+1234567810'
    },
    performance: {
      rating: 4.6,
      ordersCompleted: 0,
      customerRatings: 4.7,
      punctuality: 96,
      lastReviewDate: new Date('2026-02-25')
    },
    schedule: [
      { day: 'Tuesday', startTime: '14:00', endTime: '22:00' },
      { day: 'Wednesday', startTime: '14:00', endTime: '22:00' },
      { day: 'Thursday', startTime: '14:00', endTime: '22:00' },
      { day: 'Friday', startTime: '14:00', endTime: '22:00' },
      { day: 'Saturday', startTime: '14:00', endTime: '22:00' }
    ],
    status: 'active',
    notes: 'Warm and welcoming, great at managing reservations'
  },
  {
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@restaurant.com',
    phone: '+1234567811',
    jobTitle: 'Cashier',
    department: 'Front of House',
    shift: 'Afternoon',
    hourlyRate: 16.00,
    paymentType: 'hourly',
    hireDate: new Date('2025-06-01'),
    dateOfBirth: new Date('1993-12-03'),
    address: {
      street: '987 Cedar Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10006',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Margaret Taylor',
      relationship: 'Mother',
      phone: '+1234567812'
    },
    performance: {
      rating: 4.5,
      ordersCompleted: 0,
      customerRatings: 4.5,
      punctuality: 94,
      lastReviewDate: new Date('2026-03-01')
    },
    schedule: [
      { day: 'Monday', startTime: '14:00', endTime: '21:00' },
      { day: 'Tuesday', startTime: '14:00', endTime: '21:00' },
      { day: 'Wednesday', startTime: '14:00', endTime: '21:00' },
      { day: 'Thursday', startTime: '14:00', endTime: '21:00' },
      { day: 'Friday', startTime: '14:00', endTime: '22:00' }
    ],
    status: 'active',
    notes: 'Accurate and efficient with payments'
  },
  {
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@restaurant.com',
    phone: '+1234567813',
    jobTitle: 'Inventory Manager',
    department: 'Management',
    shift: 'Morning',
    salary: 3500,
    paymentType: 'monthly',
    hireDate: new Date('2025-07-15'),
    dateOfBirth: new Date('1988-04-18'),
    address: {
      street: '147 Spruce Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10007',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Tom Anderson',
      relationship: 'Spouse',
      phone: '+1234567814'
    },
    performance: {
      rating: 4.8,
      ordersCompleted: 0,
      customerRatings: 0,
      punctuality: 99,
      lastReviewDate: new Date('2026-03-01')
    },
    schedule: [
      { day: 'Monday', startTime: '07:00', endTime: '15:00' },
      { day: 'Tuesday', startTime: '07:00', endTime: '15:00' },
      { day: 'Wednesday', startTime: '07:00', endTime: '15:00' },
      { day: 'Thursday', startTime: '07:00', endTime: '15:00' },
      { day: 'Friday', startTime: '07:00', endTime: '15:00' }
    ],
    status: 'active',
    notes: 'Detail-oriented, excellent at managing stock levels'
  },
  {
    firstName: 'Carlos',
    lastName: 'Martinez',
    email: 'carlos.martinez@restaurant.com',
    phone: '+1234567815',
    jobTitle: 'Kitchen Assistant',
    department: 'Kitchen',
    shift: 'Morning',
    hourlyRate: 13.00,
    paymentType: 'hourly',
    hireDate: new Date('2025-08-20'),
    dateOfBirth: new Date('2001-09-25'),
    address: {
      street: '258 Willow Drive',
      city: 'New York',
      state: 'NY',
      zipCode: '10008',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Maria Martinez',
      relationship: 'Mother',
      phone: '+1234567816'
    },
    performance: {
      rating: 4.2,
      ordersCompleted: 0,
      customerRatings: 0,
      punctuality: 90,
      lastReviewDate: new Date('2026-02-28')
    },
    schedule: [
      { day: 'Monday', startTime: '06:00', endTime: '14:00' },
      { day: 'Tuesday', startTime: '06:00', endTime: '14:00' },
      { day: 'Wednesday', startTime: '06:00', endTime: '14:00' },
      { day: 'Thursday', startTime: '06:00', endTime: '14:00' },
      { day: 'Friday', startTime: '06:00', endTime: '14:00' }
    ],
    status: 'active',
    notes: 'Hardworking and eager to learn'
  },
  {
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@restaurant.com',
    phone: '+1234567817',
    jobTitle: 'Delivery Driver',
    department: 'Delivery',
    shift: 'Afternoon',
    hourlyRate: 15.00,
    paymentType: 'hourly',
    hireDate: new Date('2025-09-10'),
    dateOfBirth: new Date('1996-06-12'),
    address: {
      street: '369 Ash Boulevard',
      city: 'New York',
      state: 'NY',
      zipCode: '10009',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Sarah Wilson',
      relationship: 'Wife',
      phone: '+1234567818'
    },
    performance: {
      rating: 4.6,
      ordersCompleted: 980,
      customerRatings: 4.7,
      punctuality: 93,
      lastReviewDate: new Date('2026-03-01')
    },
    schedule: [
      { day: 'Tuesday', startTime: '14:00', endTime: '22:00' },
      { day: 'Wednesday', startTime: '14:00', endTime: '22:00' },
      { day: 'Thursday', startTime: '14:00', endTime: '22:00' },
      { day: 'Friday', startTime: '14:00', endTime: '22:00' },
      { day: 'Saturday', startTime: '14:00', endTime: '22:00' }
    ],
    status: 'active',
    notes: 'Reliable driver, knows the city well'
  },
  {
    firstName: 'Patricia',
    lastName: 'Brown',
    email: 'patricia.brown@restaurant.com',
    phone: '+1234567819',
    jobTitle: 'Cleaner',
    department: 'Maintenance',
    shift: 'Night',
    hourlyRate: 12.00,
    paymentType: 'hourly',
    hireDate: new Date('2025-10-05'),
    dateOfBirth: new Date('1975-02-28'),
    address: {
      street: '741 Poplar Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10010',
      country: 'USA'
    },
    emergencyContact: {
      name: 'David Brown',
      relationship: 'Son',
      phone: '+1234567820'
    },
    performance: {
      rating: 4.4,
      ordersCompleted: 0,
      customerRatings: 0,
      punctuality: 97,
      lastReviewDate: new Date('2026-03-01')
    },
    schedule: [
      { day: 'Monday', startTime: '22:00', endTime: '06:00' },
      { day: 'Tuesday', startTime: '22:00', endTime: '06:00' },
      { day: 'Wednesday', startTime: '22:00', endTime: '06:00' },
      { day: 'Thursday', startTime: '22:00', endTime: '06:00' },
      { day: 'Friday', startTime: '22:00', endTime: '06:00' }
    ],
    status: 'active',
    notes: 'Thorough and maintains high cleanliness standards'
  }
];

async function seedEmployeeData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing employees
    await Employee.deleteMany({});
    console.log('Cleared existing employees');

    // Insert seed data
    const insertedEmployees = await Employee.insertMany(seedEmployees);
    console.log(`✅ Successfully seeded ${insertedEmployees.length} employees`);

    // Display summary
    console.log('\n📊 Employee Summary:');
    const departments = await Employee.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    departments.forEach(dept => {
      console.log(`  ${dept._id}: ${dept.count} employees`);
    });

    console.log('\n👥 Employee List:');
    insertedEmployees.forEach((emp, index) => {
      console.log(`  ${index + 1}. ${emp.fullName} - ${emp.jobTitle} (${emp.employeeCode})`);
    });

    await mongoose.connection.close();
    console.log('\n✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedEmployeeData();
