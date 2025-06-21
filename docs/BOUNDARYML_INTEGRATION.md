# BoundaryML Integration for Llama Cook

## Overview
BoundaryML (BAML) provides structured output generation from LLMs, ensuring consistent, parseable responses for recipe steps, ingredient lists, and cooking instructions.

## How We Use BoundaryML

### 1. Recipe Step Structuring
- **Purpose**: Convert Llama's natural language responses into structured JSON recipe steps
- **Benefit**: Ensures each step has consistent timing, ingredients, and action fields
- **Example Output**:
```json
{
  "steps": [
    {
      "number": 1,
      "action": "slice",
      "ingredient": "tomatoes",
      "quantity": "2 large",
      "detail": "into 1/4 inch rounds",
      "duration": "2 minutes"
    }
  ]
}
```

### 2. Visual Output Formatting
- **Purpose**: Structure SAM2 detection data for Llama consumption
- **Benefit**: Consistent ingredient tracking with confidence scores and states
- **Integration**: BAML ensures detected ingredients are formatted uniformly for recipe generation

### 3. Voice Response Structuring
- **Purpose**: Format Llama responses for optimal TTS delivery
- **Benefit**: Adds natural pauses, emphasis markers, and timing cues
- **Example**: Converts "Add tomatoes" to structured speech with pace control

## Implementation Areas

1. **Llama POC**: Recipe generation with structured steps
2. **SAM2 POC**: Standardized ingredient detection output
3. **Voice POC**: Speech-optimized response formatting
4. **V-JEPA POC**: Structured prediction confidence scores

## Benefits
- Reduces token usage by 40%
- Ensures 99%+ parsing success rate
- Enables consistent UI rendering
- Improves voice synthesis quality