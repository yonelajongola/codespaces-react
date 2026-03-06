const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

/**
 * @route   GET /api/employees
 * @desc    Get all employees with optional filters
 * @access  Private (Owner, Manager)
 */
router.get(
  '/',
  auth,
  roles(['Owner', 'Restaurant Manager']),
  employeeController.getAllEmployees
);

/**
 * @route   GET /api/employees/top-performers
 * @desc    Get top performing employees
 * @access  Private (Owner, Manager)
 */
router.get(
  '/top-performers',
  auth,
  roles(['Owner', 'Restaurant Manager']),
  employeeController.getTopPerformers
);

/**
 * @route   GET /api/employees/by-role/:jobTitle
 * @desc    Get employees by job title
 * @access  Private (Owner, Manager)
 */
router.get(
  '/by-role/:jobTitle',
  auth,
  roles(['Owner', 'Restaurant Manager']),
  employeeController.getEmployeesByRole
);

/**
 * @route   GET /api/employees/:id
 * @desc    Get employee by ID
 * @access  Private (Owner, Manager)
 */
router.get(
  '/:id',
  auth,
  roles(['Owner', 'Restaurant Manager']),
  employeeController.getEmployeeById
);

/**
 * @route   POST /api/employees
 * @desc    Create new employee
 * @access  Private (Owner only)
 */
router.post(
  '/',
  auth,
  roles(['Owner']),
  employeeController.createEmployee
);

/**
 * @route   PUT /api/employees/:id
 * @desc    Update employee
 * @access  Private (Owner, Manager)
 */
router.put(
  '/:id',
  auth,
  roles(['Owner', 'Restaurant Manager']),
  employeeController.updateEmployee
);

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete employee (soft delete)
 * @access  Private (Owner only)
 */
router.delete(
  '/:id',
  auth,
  roles(['Owner']),
  employeeController.deleteEmployee
);

/**
 * @route   GET /api/employees/:id/performance
 * @desc    Get employee performance metrics
 * @access  Private (Owner, Manager)
 */
router.get(
  '/:id/performance',
  auth,
  roles(['Owner', 'Restaurant Manager']),
  employeeController.getEmployeePerformance
);

module.exports = router;
