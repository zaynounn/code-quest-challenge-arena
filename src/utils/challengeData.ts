
export const codingChallenge = `import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.*;
import java.io.*;
import javax.sound.sampled.*;

public class AdvancedTypingTutor extends JFrame {
    // Constants
    private static final int WIDTH = 1200;
    private static final int HEIGHT = 800;
    private static final Color BACKGROUND = Color.BLACK;
    private static final Color TEXT_COLOR = Color.WHITE;
    private static final Color HIGHLIGHT_COLOR = Color.GREEN;
    private static final Color ERROR_COLOR = Color.RED;
    private static final Color KEY_COLOR = new Color(50, 50, 50);
    private static final Color HOME_KEY_COLOR = new Color(70, 70, 70);
    
    // Game state
    private String currentText = "";
    private String targetText = "";
    private int currentPos = 0;
    private int correctChars = 0;
    private int wrongChars = 0;
    private long startTime = 0;
    private long endTime = 0;
    private boolean isRunning = false;
    private int difficultyLevel = 1;
    private Map<Character, Integer> errorMap = new HashMap<>();
    private Map<String, Integer> fingerStats = new HashMap<>();
    
    // UI Components
    private JTextPane textDisplay;
    private JLabel statsLabel;
    private JLabel levelLabel;
    private JPanel keyboardPanel;
    private JButton startButton;
    private JComboBox<String> difficultyCombo;
    
    // Keyboard layout
    private static final String[] KEYBOARD_ROWS = {
        "\`1234567890-=",
        " qwertyuiop[]\\\\",
        " asdfghjkl;'",
        " zxcvbnm,./"
    };
    
    // Constructor and initialization methods
    public AdvancedTypingTutor() {
        setTitle("Advanced Java Typing Tutor");
        setSize(WIDTH, HEIGHT);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        
        initializeComponents();
        setupKeyboard();
        initializeFingerStats();
        
        setVisible(true);
    }
}`;

export interface UserData {
  name: string;
  phoneNumber: string;
  phoneType?: 'US' | 'Lebanese';
}
