
import React from 'react';
import { ImageGallery } from '@/components/admin/images/ImageGallery';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface GalleryTabProps {
  images: Array<{ name: string; publicUrl: string }>;
  selectedImage: string | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onImageSelect: (url: string) => void;
  onDeleteImage: (name: string) => void;
  onPageChange: (page: number) => void;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({
  images,
  selectedImage,
  loading,
  error,
  currentPage,
  totalPages,
  onImageSelect,
  onDeleteImage,
  onPageChange,
}) => {
  return (
    <>
      <ImageGallery 
        images={images}
        selectedImage={selectedImage}
        loading={loading}
        error={error}
        onImageSelect={onImageSelect}
        onDeleteImage={onDeleteImage}
      />
      
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(currentPage - 1)} 
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(currentPage + 1)} 
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};
