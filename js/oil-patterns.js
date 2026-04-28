// Oil Patterns Database
// House, PBA Animal, and Sport Shot patterns

const OIL_PATTERNS = [
  // House Patterns
  {
    id: "house-short",
    name: "Short House Shot",
    organization: "House",
    length: 32,
    volume: "low",
    difficulty: "easy",
    oilRatio: "3:1",
    description: "Typical short house pattern with heavy oil in the center and dry outside. Forgiving pattern that rewards accuracy.",
    recommendedBallType: "Solid or hybrid reactive with medium RG. Avoid overly aggressive balls.",
    notes: "Most common pattern for league bowling. Allows for multiple line options."
  },
  {
    id: "house-medium",
    name: "Medium House Shot",
    organization: "House",
    length: 38,
    volume: "medium",
    difficulty: "easy",
    oilRatio: "4:1",
    description: "Standard medium length house pattern. Good balance of forgiveness and challenge.",
    recommendedBallType: "Benchmark solid or hybrid reactive. Mid RG around 2.50 works well.",
    notes: "Classic league pattern. Rewards consistent release and good spare shooting."
  },
  {
    id: "house-long",
    name: "Long House Shot",
    organization: "House",
    length: 44,
    volume: "medium",
    difficulty: "easy-medium",
    oilRatio: "5:1",
    description: "Longer house pattern that requires more precision. Less margin for error outside the pocket.",
    recommendedBallType: "Pearl or polished hybrid for length. Mid to higher RG preferred.",
    notes: "Tests ability to play deeper inside. Requires good ball control."
  },
  // PBA Animal Patterns
  {
    id: "cheetah",
    name: "Cheetah",
    organization: "PBA",
    length: 35,
    volume: "low",
    difficulty: "very hard",
    oilRatio: "2:1",
    description: "Shortest and lowest volume PBA pattern. Extremely unforgiving with minimal oil. Ball burns up quickly.",
    recommendedBallType: "Urethane or low RG solid with smooth cover. Control is key over power.",
    notes: "Part of PBA Animal Patterns. Requires precise speed and rev matching."
  },
  {
    id: "wolf",
    name: "Wolf",
    organization: "PBA",
    length: 33,
    volume: "low",
    difficulty: "hard",
    oilRatio: "2.5:1",
    description: "Short pattern with slightly more oil than Cheetah. Still very challenging with quick transition.",
    recommendedBallType: "Urethane or weak solid reactive. Lower differential helps control.",
    notes: "Rewards players who can control their ball motion precisely."
  },
  {
    id: "viper",
    name: "Viper",
    organization: "PBA",
    length: 37,
    volume: "medium",
    difficulty: "hard",
    oilRatio: "3:1",
    description: "Medium length pattern with moderate volume. More forgiving than Cheetah and Wolf but still challenging.",
    recommendedBallType: "Benchmark solid or hybrid. Mid RG and differential work well.",
    notes: "Good test of fundamental bowling skills."
  },
  {
    id: "chameleon",
    name: "Chameleon",
    organization: "PBA",
    length: 39,
    volume: "medium",
    difficulty: "very hard",
    oilRatio: "3.5:1",
    description: "Medium-long pattern with varying oil distribution. Changes throughout the day requiring adjustments.",
    recommendedBallType: "Versatile solid or hybrid. Asymmetrical cores help with adjustability.",
    notes: "Named for its changing characteristics. Requires constant ball position adjustments."
  },
  {
    id: "scorpion",
    name: "Scorpion",
    organization: "PBA",
    length: 42,
    volume: "high",
    difficulty: "hard",
    oilRatio: "4:1",
    description: "Long pattern with heavy oil volume. Requires ball to store energy for strong backend.",
    recommendedBallType: "Pearl or shiny hybrid for length. Higher RG helps carry through.",
    notes: "Tests ability to project ball through the front and maintain energy."
  },
  {
    id: "shark",
    name: "Shark",
    organization: "PBA",
    length: 47,
    volume: "high",
    difficulty: "very hard",
    oilRatio: "5:1",
    description: "Longest and highest volume PBA pattern. Extremely challenging with lots of oil to navigate.",
    recommendedBallType: "Strong pearl or high RG asymmetrical. Need ball that stores and releases energy.",
    notes: "Ultimate test of power and precision. Requires aggressive equipment and precise execution."
  },
  // Sport Shot Patterns
  {
    id: "sport-short",
    name: "PBA Experience Short",
    organization: "Sport",
    length: 37,
    volume: "medium",
    difficulty: "hard",
    oilRatio: "3:1",
    description: "Sport certified short pattern. More challenging than house shots with less forgiveness.",
    recommendedBallType: "Benchmark solid with controlled motion. Avoid overly aggressive equipment.",
    notes: "Used in sport leagues and tournaments. Requires consistent release."
  },
  {
    id: "sport-medium",
    name: "PBA Experience Medium",
    organization: "Sport",
    length: 40,
    volume: "medium-high",
    difficulty: "hard",
    oilRatio: "4:1",
    description: "Medium length sport pattern. Good balance of challenge and playability.",
    recommendedBallType: "Versatile solid or hybrid. Mid-range RG and differential.",
    notes: "Common sport league pattern. Tests fundamental skills."
  },
  {
    id: "sport-long",
    name: "PBA Experience Long",
    organization: "Sport",
    length: 45,
    volume: "high",
    difficulty: "very hard",
    oilRatio: "5:1",
    description: "Long sport pattern with heavy oil. Requires precise ball placement and strong backend motion.",
    recommendedBallType: "Pearl or polished asymmetrical. Higher RG for length and carry.",
    notes: "Challenging pattern that rewards power and precision."
  }
];

// Pattern difficulty multipliers for scoring
const PATTERN_DIFFICULTY_MULTIPLIERS = {
  "easy": 1.0,
  "easy-medium": 1.1,
  "medium": 1.2,
  "hard": 1.3,
  "very hard": 1.4
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OIL_PATTERNS, PATTERN_DIFFICULTY_MULTIPLIERS };
}
