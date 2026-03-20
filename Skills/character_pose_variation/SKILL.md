---
name: Character Pose Variation
description: Generate variations of a character in different poses or outfits while strictly maintaining the original art style, character design, and line quality.
---

# Character Pose Variation Skill

This skill is designed to generate new images of an existing character in different poses, outfits, or settings while preserving the specific art style, facial features, proportions, and "touch" of the original reference image.

## Instructions

When the user asks to change the pose, outfit, or background of a character without changing the style:

1.  **Analyze the Reference Image**:
    *   Identify the key style elements: line weight (thick/thin), coloring style (flat, shaded, gradient), textured vs. smooth looks, eye shape, and proportions.
    *   Identify the character's key features: fur/skin color patterns, specific accessories, body shape.

2.  **Construct the Prompt**:
    *   **Reference**: Always pass the original image path in the `image_paths` argument of the `generate_image` tool.
    *   **Subject Description**: Describe the character in detail as they appear in the reference (e.g., "The Siamese cat character from the reference...").
    *   **Action/Change**: Clearly state the new pose, outfit, or background (e.g., "...wearing a business jacket, standing in an office background...").
    *   **Style Enforcers**: Include strong keywords to enforce style consistency. Use phrases like:
        *   "Maintain the exact same art style, character design, colors, and line weight as the reference image."
        *   "High quality, character design sheet style."
        *   "Consistent character model."
    *   **Negative Constraints** (Implicitly in prompt or mental check): Ensure the prompt doesn't drift into generic styles (like "photorealistic" or "sketchy") unless requested.

3.  **Tool Usage**:
    *   Use the `generate_image` tool.
    *   Set `image_paths` to include the user's provided reference image.
    *   Use the constructed prompt.

## Example Prompts

**Request**: "Make this cat sit down, but keep the style exactly the same."

**Prompt**:
> The Siamese cat character from the reference image, sitting down comfortably facing the front. Maintain the exact same art style, character design, colors, and line weight as the reference image. White background.

**Request**: "Put a jacket on this character and put them in an office."

**Prompt**:
> The character from the reference image. The character is now wearing a smart business jacket. The background is a modern, stylish office interior. Maintain the exact same art style, line quality, and character proportions as the reference.

## Tips for Success
*   If the result looks too different, emphasize "Exact character match" or "Reference sheet style" in the prompt.
*   Keep the background simple (or specified) to avoid style bleeding from complex backgrounds if not needed.
