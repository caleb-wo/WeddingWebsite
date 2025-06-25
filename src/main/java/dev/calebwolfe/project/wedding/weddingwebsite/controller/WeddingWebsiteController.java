package dev.calebwolfe.project.wedding.weddingwebsite.controller;

import dev.calebwolfe.project.wedding.weddingwebsite.PaginatedImageResponse.PaginatedImageResponse;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

// Logging
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
public class WeddingWebsiteController implements ApplicationListener<ContextRefreshedEvent> {

    private final Logger logger = LoggerFactory.getLogger(WeddingWebsiteController.class);

    // --- Static Resources & Configuration ---
    private static final String GALLERY_IMAGE_RESOURCE_PATH_PATTERN = "classpath*:static/images/gallery/*.webp";
    private static final String GALLERY_BROWSER_BASE_PATH = "/images/gallery/"; // Image path
    private static final int DEFAULT_PAGE_SIZE = 9; // Frontend it styled for 9 images at a time.

    // List to store all IMAGE RELATIVE URLs (e.g., /images/gallery/image1.webp)
    private volatile List<String> allImageRelativeUrls = Collections.emptyList();

    // --- Application Startup Listener (Caching Image URLs) ---
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (event.getApplicationContext().getParent() == null) {
            try {
                PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
                Resource[] resources = resolver.getResources(GALLERY_IMAGE_RESOURCE_PATH_PATTERN);

                List<String> discoveredImageFilenames = Arrays.stream(resources)
                        .map(Resource::getFilename)
                        .filter(filename -> filename != null && filename.endsWith(".webp"))
                        .sorted()
                        .collect(Collectors.toList());

                // Construct relative URLs
                this.allImageRelativeUrls = discoveredImageFilenames.stream()
                        .map(filename -> GALLERY_BROWSER_BASE_PATH + filename)
                        .collect(Collectors.toUnmodifiableList());

                logger.info("Gallery image URLs loaded: {} image", allImageRelativeUrls.size());

            } catch (IOException e) {
                logger.error("Error loading image gallery on startup: {}", e.getMessage());
                this.allImageRelativeUrls = Collections.emptyList();
            }
        }
    }

    // --- Thymeleaf View Controllers ---
    @GetMapping("/home")
    public String home() {
        return "index";
    }

    @GetMapping("/gallery")
    public String gallery(Model model) {
        model.addAttribute("totalGalleryImages", allImageRelativeUrls.size());
        return "pages/gallery";
    }

    @GetMapping("/schedule")
    public String schedule() {
        return "pages/schedule";
    }

    @GetMapping("/registry")
    public String registry() {
        return "pages/registry";
    }

    @GetMapping("/additional")
    public String additional() {
        return "pages/additional";
    }

    @GetMapping("/rsvp")
    public String rsvp() {
        return "pages/rsvp";
    }

    // --- API endpoint for paginated gallery images ---
    @GetMapping("/images")
    @ResponseBody
    public PaginatedImageResponse getGalleryImagesApi(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "" + DEFAULT_PAGE_SIZE) int size) {

        if (page < 1) page = 1;
        if (size < 1) size = DEFAULT_PAGE_SIZE;

        int totalImages = allImageRelativeUrls.size();
        int totalPages = (int) Math.ceil((double) totalImages / size);

        if (totalPages == 0) {
            return new PaginatedImageResponse(Collections.emptyList(), 0, size, 0, 0);
        }
        if (page > totalPages) {
            page = totalPages;
        }

        long startIndex = (long) (page - 1) * size;
        long endIndex = Math.min(startIndex + size, totalImages);

        List<String> pagedImageUrls;
        if (startIndex >= totalImages) {
            pagedImageUrls = Collections.emptyList();
        } else {
            // Using the cached relative URLs
            pagedImageUrls = allImageRelativeUrls.subList((int) startIndex, (int) endIndex);
        }

        return new PaginatedImageResponse(pagedImageUrls, page, size, totalImages, totalPages);
    }

}