export type SampleReview = {
  id: string;
  name: string;
  title: string;
  body: string;
  rating: number;
};

export const sampleProductReviews: Record<string, readonly SampleReview[]> = {
  "orbit-headphones": [
    {
      id: "pulse-review-1",
      name: "Jordan R.",
      title: "A thoughtful portable shape",
      body: "The compact proportions and finish choices make this a fun concept to explore.",
      rating: 5,
    },
    {
      id: "pulse-review-2",
      name: "Casey M.",
      title: "Easy to personalize",
      body: "I like being able to compare the grille and color combinations in the configurator.",
      rating: 4,
    },
  ],
  "orbit-studio": [
    {
      id: "monitor-review-1",
      name: "Avery T.",
      title: "Clean studio look",
      body: "The monitor has a focused design, and the orientation option is a nice detail.",
      rating: 5,
    },
    {
      id: "monitor-review-2",
      name: "Morgan L.",
      title: "A useful visual preview",
      body: "The 3D view makes the cabinet proportions easier to understand.",
      rating: 4,
    },
  ],
  "orbit-flex": [
    {
      id: "vinyl-review-1",
      name: "Riley P.",
      title: "A modern take on vinyl",
      body: "The color palette gives this turntable concept a playful but considered feel.",
      rating: 5,
    },
    {
      id: "vinyl-review-2",
      name: "Sam K.",
      title: "Nice detail options",
      body: "Being able to switch the platter mat helps the overall design feel personal.",
      rating: 4,
    },
  ],
  "orbit-one": [
    {
      id: "one-review-1",
      name: "Taylor N.",
      title: "A confident silhouette",
      body: "The headphone concept looks comfortable and the finish choices feel distinctive.",
      rating: 5,
    },
    {
      id: "one-review-2",
      name: "Alex D.",
      title: "Fun to configure",
      body: "The 3D preview makes it simple to compare cushion and color combinations.",
      rating: 4,
    },
  ],
};
