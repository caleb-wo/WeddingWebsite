package dev.calebwolfe.project.wedding.weddingwebsite.PaginatedImageResponse;
import java.util.List;

// --- Helper Class for JSON Response (No changes needed here) ---
public class PaginatedImageResponse {
    private List<String> images;
    private int currentPage;
    private int pageSize;
    private long totalImages;
    private int totalPages;
    private String error;

    public PaginatedImageResponse(List<String> images, int currentPage, int pageSize, long totalImages, int totalPages) {
        this.images = images;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalImages = totalImages;
        this.totalPages = totalPages;
    }

    public PaginatedImageResponse(List<String> images, int currentPage, int pageSize, long totalImages, int totalPages, String error) {
        this(images, currentPage, pageSize, totalImages, totalPages);
        this.error = error;
    }

    public List<String> getImages() { return images; }
    public int getCurrentPage() { return currentPage; }
    public int getPageSize() { return pageSize; }
    public long getTotalImages() { return totalImages; }
    public int getTotalPages() { return totalPages; }
    public String getError() { return error; }
}