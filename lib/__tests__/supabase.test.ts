import { uploadFile, deleteFile, supabase } from '../supabase';
import { createClient } from '@supabase/supabase-js';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    auth: {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn()
    },
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: { path: 'test/123456.pdf' },
          error: null
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/test/123456.pdf' }
        }),
        remove: jest.fn().mockResolvedValue({ error: null })
      })
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis()
    })
  })
}));

// Mock process.env
const originalEnv = process.env;

describe('Supabase Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_KEY: 'test-service-key'
    };

    // Potlačit výpisy do konzole během testu
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env = originalEnv;
  });

  describe('supabase', () => {
    it('should export a Supabase client', () => {
      expect(supabase).toBeDefined();
      expect(createClient).toHaveBeenCalled();
    });
  });

  // Tyto funkce nejsou exportovány z lib/supabase.ts, proto testy odstraníme

  describe('Storage Utilities', () => {
    describe('uploadFile', () => {
      it('should upload file and return path and public URL', async () => {
        const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

        const result = await uploadFile(mockFile, 'test');

        expect(result).toHaveProperty('path');
        expect(result).toHaveProperty('url');
        expect(result.url).toContain('https://example.com/');

        // Verify Supabase client was called correctly
        expect(supabase.storage.from).toHaveBeenCalledWith('bonds');
        expect(supabase.storage.from().upload).toHaveBeenCalledWith(
          expect.stringContaining('test/'),
          mockFile
        );
    });

      it('should throw error when upload fails', async () => {
        // Override the mock for this test to simulate failure
        supabase.storage.from().upload.mockResolvedValueOnce({
          data: null,
          error: { message: 'Upload failed' }
        });

        const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

        await expect(uploadFile(mockFile, 'test')).rejects.toThrow('Upload failed');
      });
    });
  });

    describe('deleteFile', () => {
      it('should delete file and return true', async () => {
        const result = await deleteFile('test/123456.pdf');

        expect(result).toBe(true);

        // Verify Supabase client was called correctly
        expect(supabase.storage.from).toHaveBeenCalledWith('bonds');
        expect(supabase.storage.from().remove).toHaveBeenCalledWith(['test/123456.pdf']);
      });

      it('should throw error when delete fails', async () => {
        // Override the mock for this test to simulate failure
        supabase.storage.from().remove.mockResolvedValueOnce({
          error: { message: 'Delete failed' }
        });

        await expect(deleteFile('test/123456.pdf')).rejects.toThrow('Delete failed');
      });
    });
});