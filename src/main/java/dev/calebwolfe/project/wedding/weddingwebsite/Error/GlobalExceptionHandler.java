package dev.calebwolfe.project.wedding.weddingwebsite.Error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException; // Important for handling 404s for API
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.io.IOException;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String ERROR_TACK = " Send me a screenshot of the error and text me so I can fix this! 909-641-6893"; // Will be 'tacked' to the back of each error message.
    private static final String DEFAULT_ERROR_PAGE = "error";

    private ModelAndView createErrorModelAndView(HttpStatus status, String details, String path){
        // Create the ModelAndView object and set the view name
        ModelAndView mav = new ModelAndView(DEFAULT_ERROR_PAGE);

        // Create the ErrorDetails payload
        ErrorDetails errorDetails = new ErrorDetails(status, details, path);

        // Transfer fields from error details to model.
        mav.addObject("timestamp", errorDetails.getTimestamp());
        mav.addObject("status", errorDetails.getStatus().value());
        mav.addObject("error", errorDetails.getError());
        mav.addObject("details", errorDetails.getDetails());
        mav.addObject("path", errorDetails.getPath());

        // 4. Set the HTTP status for the response
        mav.setStatus(status);

        return mav;
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ModelAndView handleNoHandlerFoundException(NoHandlerFoundException ex, WebRequest request){
        logger.warn("No handler found for {} {}", ex.getHttpMethod(), ex.getRequestURL());
        return createErrorModelAndView(
                HttpStatus.NOT_FOUND,
                ("The requested page wasn't found!"),
                request.getDescription(false)
        );
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ModelAndView handleNoResourceFoundException(NoResourceFoundException ex, WebRequest request){
        logger.warn("No static page found for {}", ex.getMessage());
        return createErrorModelAndView(
                HttpStatus.NOT_FOUND,
                "The requested page or resource wasn't found!",
                request.getDescription(false)
        );
    }

    @ExceptionHandler(IOException.class)
    public ModelAndView handleIOException(IOException ex, WebRequest request){
        logger.error("IO error during request processing: {}", ex.getMessage(), ex);
        return createErrorModelAndView(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ("A problem occurred processing files! Sorry about that."+ERROR_TACK),
                request.getDescription(false)
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ModelAndView handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request){
        logger.error("Invalid argument: {}", ex.getMessage(), ex);
        return createErrorModelAndView(
                HttpStatus.BAD_REQUEST,
                (ex.getMessage()+ERROR_TACK),
                request.getDescription(false)
        );
    }

    @ExceptionHandler(Exception.class)
    public ModelAndView handleGlobalException(Exception ex, WebRequest request){
        logger.error("An unexpected error occurred: {}", ex.getMessage(), ex);
        return createErrorModelAndView(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ("An unexpected error occurred. Please try later."+ERROR_TACK),
                request.getDescription(false)
        );
    }
}