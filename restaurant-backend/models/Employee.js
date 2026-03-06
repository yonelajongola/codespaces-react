const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: { type: String, default: 'USA' }
}, { _id: false });

const emergencyContactSchema = new mongoose.Schema({
  name: String,
  relationship: String,
  phone: String
}, { _id: false });

const performanceSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ordersCompleted: {
    type: Number,
    default: 0
  },
  customerRatings: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  punctuality: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  lastReviewDate: Date
}, { _id: false });

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  employeeCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true,
    enum: [
      'Restaurant Manager',
      'Head Chef',
      'Line Cook',
      'Waiter',
      'Host',
      'Cashier',
      'Inventory Manager',
      'Kitchen Assistant',
      'Delivery Driver',
      'Cleaner'
    ]
  },
  department: {
    type: String,
    required: true,
    enum: ['Kitchen', 'Front of House', 'Management', 'Delivery', 'Maintenance']
  },
  shift: {
    type: String,
    required: true,
    enum: ['Morning', 'Afternoon', 'Night', 'Full Day']
  },
  hourlyRate: {
    type: Number,
    min: 0
  },
  salary: {
    type: Number,
    min: 0
  },
  paymentType: {
    type: String,
    required: true,
    enum: ['hourly', 'monthly', 'weekly']
  },
  hireDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateOfBirth: {
    type: Date
  },
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
  performance: {
    type: performanceSchema,
    default: () => ({})
  },
  schedule: [scheduleSchema],
  status: {
    type: String,
    enum: ['active', 'on_leave', 'terminated'],
    default: 'active'
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Indexes
employeeSchema.index({ employeeCode: 1 });
employeeSchema.index({ jobTitle: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ userId: 1 });
employeeSchema.index({ email: 1 });

// Virtual for full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for years of service
employeeSchema.virtual('yearsOfService').get(function() {
  if (!this.hireDate) return 0;
  const now = new Date();
  const years = (now - this.hireDate) / (1000 * 60 * 60 * 24 * 365);
  return Math.floor(years * 10) / 10; // Round to 1 decimal place
});

// Method to calculate total compensation
employeeSchema.methods.calculateMonthlyCompensation = function() {
  if (this.paymentType === 'monthly') {
    return this.salary;
  } else if (this.paymentType === 'hourly' && this.hourlyRate) {
    // Assume 40 hours per week * 4 weeks
    return this.hourlyRate * 40 * 4;
  }
  return 0;
};

// Static method to generate employee code
employeeSchema.statics.generateEmployeeCode = async function() {
  const count = await this.countDocuments();
  const code = `EMP${String(count + 1).padStart(3, '0')}`;
  
  // Check if code exists
  const exists = await this.findOne({ employeeCode: code });
  if (exists) {
    return `EMP${String(count + 2).padStart(3, '0')}`;
  }
  return code;
};

// Pre-save middleware to auto-generate employee code
employeeSchema.pre('save', async function(next) {
  if (this.isNew && !this.employeeCode) {
    this.employeeCode = await this.constructor.generateEmployeeCode();
  }
  next();
});

// Ensure virtuals are included when converting to JSON
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
