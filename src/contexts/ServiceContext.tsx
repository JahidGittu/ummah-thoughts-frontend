// ============================================================
// Service Context Providers - Global Service Access
// ============================================================
'use client';

import React, { createContext, useContext } from 'react';
import { WriterService } from '@/services/WriterService';
import { DebateService } from '@/services/DebateService';
import { AdminService } from '@/services/AdminService';
import { UserService } from '@/services/UserService';

// ============================================================
// Service Singleton Instances
// ============================================================

const writerService = new WriterService();
const debateService = new DebateService();
const adminService = new AdminService();
const userService = new UserService();

// ============================================================
// Context Type Definition
// ============================================================

interface ServiceContextType {
  writerService: WriterService;
  debateService: DebateService;
  adminService: AdminService;
  userService: UserService;
}

// ============================================================
// Context Creation
// ============================================================

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// ============================================================
// Provider Component
// ============================================================

interface ServiceProviderProps {
  children: React.ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const value: ServiceContextType = {
    writerService,
    debateService,
    adminService,
    userService,
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
}

// ============================================================
// Hook to Access Services
// ============================================================

export function useServices() {
  const context = useContext(ServiceContext);
  
  if (context === undefined) {
    throw new Error(
      'useServices must be used within ServiceProvider. ' +
      'Wrap your app with <ServiceProvider> in the root layout.'
    );
  }

  return context;
}

// ============================================================
// Individual Service Hooks (Alternative API)
// ============================================================

/**
 * Get direct access to WriterService
 * Useful when you only need writer operations
 * 
 * Example:
 *   const service = useWriterService()
 *   const articles = service.getPublishedArticles()
 */
export function useWriterService() {
  const { writerService } = useServices();
  return writerService;
}

/**
 * Get direct access to DebateService
 * Useful for debate-specific operations
 * 
 * Example:
 *   const service = useDebateService()
 *   const debates = service.getScheduledDebates()
 */
export function useDebateService() {
  const { debateService } = useServices();
  return debateService;
}

/**
 * Get direct access to AdminService
 * Useful for admin operations
 * 
 * Example:
 *   const service = useAdminService()
 *   const requests = service.getRoleRequests()
 */
export function useAdminService() {
  const { adminService } = useServices();
  return adminService;
}

/**
 * Get direct access to UserService
 * Useful for user profile operations
 * 
 * Example:
 *   const service = useUserService()
 *   const profile = service.getProfile(userId)
 */
export function useUserService() {
  const { userService } = useServices();
  return userService;
}

// ============================================================
// Convenience Hook - Get all services at once
// ============================================================

/**
 * Get all four services as an object
 * Useful when a component needs multiple services
 * 
 * Example:
 *   const { writerService, debateService } = useAllServices()
 *   const articles = writerService.getPublishedArticles()
 *   const debates = debateService.getScheduledDebates()
 */
export function useAllServices() {
  return useServices();
}

export default ServiceProvider;
