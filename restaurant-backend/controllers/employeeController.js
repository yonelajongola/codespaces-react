const Employee = require('../models/Employee');
const Order = require('../models/Order');

/**
 * Get all employees with optional filters
 * GET /api/employees
 */
const getAllEmployees = async (req, res) => {
  try {
    const { jobTitle, department, status, shift, page = 1, limit = 50 } = req.query;
    
    // Build filter object
    const filter = {};
    if (jobTitle) filter.jobTitle = jobTitle;
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (shift) filter.shift = shift;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get employees with pagination
    const employees = await Employee.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');
    
    const total = await Employee.countDocuments(filter);
    
    // Get summary statistics
    const summary = {
      total,
      active: await Employee.countDocuments({ status: 'active' }),
      onLeave: await Employee.countDocuments({ status: 'on_leave' }),
      terminated: await Employee.countDocuments({ status: 'terminated' }),
      byDepartment: {}
    };
    
    // Count by department
    const departments = ['Kitchen', 'Front of House', 'Management', 'Delivery', 'Maintenance'];
    for (const dept of departments) {
      summary.byDepartment[dept] = await Employee.countDocuments({ 
        department: dept, 
        status: 'active' 
      });
    }
    
    res.json({
      success: true,
      data: {
        employees,
        summary,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message
    });
  }
};

/**
 * Get employee by ID
 * GET /api/employees/:id
 */
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findById(id)
      .populate('userId', 'email role lastLogin')
      .select('-__v');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
      error: error.message
    });
  }
};

/**
 * Create new employee
 * POST /api/employees
 */
const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    
    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email: employeeData.email });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'Employee with this email already exists'
      });
    }
    
    // Create new employee
    const employee = new Employee(employeeData);
    await employee.save();
    
    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: {
        employeeId: employee._id,
        employeeCode: employee.employeeCode,
        firstName: employee.firstName,
        lastName: employee.lastName,
        jobTitle: employee.jobTitle,
        status: employee.status
      }
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error.message
    });
  }
};

/**
 * Update employee
 * PUT /api/employees/:id
 */
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Prevent updating certain fields
    delete updates.employeeCode;
    delete updates.userId;
    delete updates.createdAt;
    
    const employee = await Employee.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: {
        employeeId: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        jobTitle: employee.jobTitle,
        department: employee.department,
        shift: employee.shift,
        hourlyRate: employee.hourlyRate,
        salary: employee.salary,
        status: employee.status,
        updatedAt: employee.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message
    });
  }
};

/**
 * Delete employee (soft delete - change status to terminated)
 * DELETE /api/employees/:id
 */
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findByIdAndUpdate(
      id,
      { $set: { status: 'terminated' } },
      { new: true }
    );
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Employee removed successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message
    });
  }
};

/**
 * Get employee performance metrics
 * GET /api/employees/:id/performance
 */
const getEmployeePerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    
    const employee = await Employee.findById(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    // Default to current month if no dates provided
    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1));
    const end = endDate ? new Date(endDate) : new Date();
    
    // Get orders for this employee in the date range
    let ordersServed = 0;
    let totalRevenue = 0;
    let orderIds = [];
    
    if (employee.userId) {
      const orders = await Order.find({
        waiterUserId: employee.userId,
        createdAt: { $gte: start, $lte: end },
        status: 'completed'
      });
      
      ordersServed = orders.length;
      totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      orderIds = orders.map(o => o._id);
    }
    
    const averageOrderValue = ordersServed > 0 ? totalRevenue / ordersServed : 0;
    
    // Calculate hours worked (approximate based on schedule)
    const daysInPeriod = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const weeksInPeriod = daysInPeriod / 7;
    const scheduledDays = employee.schedule?.length || 5;
    const hoursPerDay = 8; // Default
    const hoursWorked = Math.floor(weeksInPeriod * scheduledDays * hoursPerDay);
    
    // Determine efficiency rating
    let efficiency = 'Good';
    if (employee.performance?.rating >= 4.5) efficiency = 'Excellent';
    else if (employee.performance?.rating >= 4.0) efficiency = 'Very Good';
    else if (employee.performance?.rating >= 3.5) efficiency = 'Good';
    else if (employee.performance?.rating >= 3.0) efficiency = 'Average';
    else efficiency = 'Needs Improvement';
    
    res.json({
      success: true,
      data: {
        employeeId: employee._id,
        name: employee.fullName,
        jobTitle: employee.jobTitle,
        period: {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
        },
        performance: {
          ordersServed,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100,
          customerRating: employee.performance?.customerRatings || 0,
          punctuality: employee.performance?.punctuality || 100,
          hoursWorked,
          efficiency
        }
      }
    });
  } catch (error) {
    console.error('Error fetching employee performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee performance',
      error: error.message
    });
  }
};

/**
 * Get employees by job title
 * GET /api/employees/by-role/:jobTitle
 */
const getEmployeesByRole = async (req, res) => {
  try {
    const { jobTitle } = req.params;
    
    const employees = await Employee.find({ 
      jobTitle, 
      status: 'active' 
    })
    .select('firstName lastName email phone shift performance')
    .sort({ 'performance.rating': -1 });
    
    res.json({
      success: true,
      data: {
        jobTitle,
        count: employees.length,
        employees
      }
    });
  } catch (error) {
    console.error('Error fetching employees by role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message
    });
  }
};

/**
 * Get top performing employees
 * GET /api/employees/top-performers
 */
const getTopPerformers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const employees = await Employee.find({ status: 'active' })
      .sort({ 'performance.rating': -1, 'performance.ordersCompleted': -1 })
      .limit(parseInt(limit))
      .select('firstName lastName jobTitle department performance');
    
    res.json({
      success: true,
      data: {
        topPerformers: employees.map((emp, index) => ({
          rank: index + 1,
          employeeId: emp._id,
          name: emp.fullName,
          jobTitle: emp.jobTitle,
          department: emp.department,
          rating: emp.performance?.rating || 0,
          ordersCompleted: emp.performance?.ordersCompleted || 0
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching top performers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top performers',
      error: error.message
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeePerformance,
  getEmployeesByRole,
  getTopPerformers
};
