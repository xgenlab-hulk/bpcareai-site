/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  async redirects() {
    const slugRedirects = [
        {
            "source": "/articles/when-to-worry-about-post-dinner-brain-fog-distinguishing-carbohydrate-induced-neuroglycopenia-from-early-cerebral-microvascular-dysregulation-in-adults-65-with-long-standing-diabetes",
            "destination": "/articles/post-dinner-brain-fog-diabetes-65",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-normal-looking-blood-pressure-readings-in-adults-78-with-advanced-ckd-stage-4-why-brachial-cuff-readings-systematically-underestimate-central-aortic-pressure",
            "destination": "/articles/blood-pressure-underestimation-in-advanced-ckid",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-10-minute-gratitude-walks-after-holiday-dinners-effects-on-postprandial-inflammatory-cytokines-and-glucose-variability-in-adults-64-with-elevated-hs-crp",
            "destination": "/articles/gratitude-walks-post-holiday-dinner",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-navigating-holiday-potlucks-with-type-1-diabetes-from-pre-meal-bolus-timing-to-carb-counting-secret-sauces-and-emergency-hypo-kits-for-multi-hour-events",
            "destination": "/articles/type-1-diabetes-holiday-potluck-guide",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-reduce-postprandial-blood-pressure-drops-within-60-seconds-using-supine-leg-elevation-expiratory-resistance-breathing-in-adults-74-with-orthostatic-hypotension",
            "destination": "/articles/quick-fix-for-postprandial-hypotension-seniors",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-atrial-myocyte-calcium-handling-without-increasing-serca2a-oxidation-using-taurine-vitamin-b6-timing-in-adults-63-with-early-diastolic-stiffness",
            "destination": "/articles/taurine-vitamin-b6-atrial-calcium-handling",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-stabilize-cardiac-fibroblast-activity-without-suppressing-wound-healing-using-modified-citrus-pectin-zinc-carnosine-timing-in-adults-67-with-post-mi-remodeling",
            "destination": "/articles/natural-cardiac-fibroblast-stabilization-post-mi",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-modulate-the-gut-kidney-axis-without-probiotic-strain-overload-using-fermented-oat-bran-low-dose-betaine-to-reduce-renal-sympathetic-drive-in-adults-63-with-mild-hypertension",
            "destination": "/articles/gut-kidney-axis-modulation-for-bp-control",
            "permanent": true
        },
        {
            "source": "/articles/how-frequent-use-of-over-the-counter-nasal-decongestant-sprays-without-prescription-oversight-elevates-24-hour-pulse-pressure-in-adults-55-64-with-mild-asthma",
            "destination": "/articles/nasal-decongestants-and-pulse-pressure-in-asthma",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-400-mg-coenzyme-q10-really-improve-ejection-fraction-in-adults-66-with-ischemic-cardiomyopathy-on-max-tolerated-gdmt-new-data-from-the-q-core-trial",
            "destination": "/articles/coq10-and-ejection-fraction-ischemic-cardiomyopathy",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-200-mg-quercetin-supplementation-really-improve-microvascular-reactivity-in-adults-59-66-with-hypertensive-retinopathy-a-12-week-rct-analysis",
            "destination": "/articles/quercetin-and-hypertensive-retinopathy-microvascular",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-traditional-holiday-fruitcake-vs-almond-flour-citrus-loaf-impact-on-2-hour-postprandial-triglyceride-rich-lipoprotein-clearance-in-adults-60-with-diabetic-dyslipidemia",
            "destination": "/articles/fruitcake-vs-almond-flour-loaf-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/7-hidden-glycemic-traps-in-healthy-holiday-buffets-why-roasted-brussels-sprouts-with-balsamic-glaze-lentil-salad-and-herb-roasted-carrots-often-spike-glucose-more-than-mashed-potatoes",
            "destination": "/articles/healthy-holiday-buffet-glycemic-traps",
            "permanent": true
        },
        {
            "source": "/articles/12-natural-ways-to-stabilize-morning-fasting-glucose-without-adjusting-insulin-using-circadian-optimized-sleep-hygiene-late-night-protein-timing-in-adults-55-63",
            "destination": "/articles/stabilize-morning-glucose-without-insulin",
            "permanent": true
        },
        {
            "source": "/articles/12-foods-that-stabilize-atrial-electrophysiology-not-just-heart-healthy-including-fermented-kimchi-roasted-walnuts-and-low-histamine-pear-compote-for-adults-57-71",
            "destination": "/articles/atrial-stabilizing-foods-holiday-heart",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-plate-mapping-for-seniors-with-macular-degeneration-using-color-contrast-texture-cues-and-portion-size-landmarks-to-prevent-overeating",
            "destination": "/articles/plate-mapping-macular-degeneration-seniors",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-daily-12-second-breath-hold-intervals-after-nasal-saline-rinse-effects-on-endothelial-dependent-vasodilation-in-adults-58-65-with-prehypertension",
            "destination": "/articles/nasal-rinse-breath-hold-for-endothelial-function",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-earliest-blood-pressure-patterns-that-predict-progression-from-prehypertension-to-stage-1-hypertension-in-adults-52-57-with-family-history",
            "destination": "/articles/prehypertension-progression-predictors-midlife",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-normal-resting-heart-rate-is-masking-sinus-node-dysfunction-especially-if-you-re-a-woman-over-66-with-unexplained-morning-fatigue-and-blunted-hrv",
            "destination": "/articles/normal-resting-heart-rate-sinus-node-dysfunction",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-non-alcoholic-mulled-wine-sparkling-ciders-why-83-contain-residual-ethanol-histamine-levels-that-trigger-atrial-ectopy-in-adults-67-with-histamine-intolerance",
            "destination": "/articles/non-alcoholic-drinks-holiday-heart-syndrome",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-blood-pressure-friendly-herbal-teas-marketed-to-women-over-65-why-84-contain-vasopressin-mimetic-alkaloids-that-worsen-diastolic-stiffness",
            "destination": "/articles/herbal-teas-and-diastolic-stiffness-in-women",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-interpreting-ambulatory-arterial-stiffness-index-aasi-from-home-bp-monitors-that-support-it-what-it-reveals-about-microvascular-health-in-adults-60-72",
            "destination": "/articles/ambulatory-arterial-stiffness-index-interpretation",
            "permanent": true
        },
        {
            "source": "/articles/simple-steps-to-convert-your-holiday-cookie-swap-into-a-glucose-responsive-event-with-real-time-cgm-feedback-portion-mapping-and-peer-accountability-frameworks",
            "destination": "/articles/holiday-cookie-swap-glucose-management",
            "permanent": true
        },
        {
            "source": "/articles/simple-steps-to-calibrate-your-home-blood-pressure-cuff-before-every-use-especially-when-ambient-humidity-exceeds-65-in-adults-69-with-salt-sensitive-hypertension",
            "destination": "/articles/home-bp-cuff-calibration-in-high-humidity",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-i-can-skip-my-meds-this-week-since-i-m-eating-less-why-holiday-medication-holidays-double-hypoglycemia-risk-in-adults-66-on-sulfonylureas",
            "destination": "/articles/holiday-medication-holiday-myths-facts",
            "permanent": true
        },
        {
            "source": "/articles/how-long-term-exposure-to-residential-microwave-oven-leakage-even-below-fcc-limits-correlates-with-24-hour-mean-arterial-pressure-variability-in-adults-75-living-alone",
            "destination": "/articles/microwave-leakage-and-blood-pressure-variability",
            "permanent": true
        },
        {
            "source": "/articles/how-late-night-holiday-snacking-alters-hepatic-gluconeogenesis-gene-expression-evidence-from-liver-biopsy-transcriptomics-in-adults-52-61-with-insulin-resistance",
            "destination": "/articles/late-night-snacking-hepatic-gluconeogenesis",
            "permanent": true
        },
        {
            "source": "/articles/how-intermittent-socializing-affects-postprandial-glucose-stability-why-skipping-grandchildren-s-mealtime-conversations-raises-glycemic-variability-more-than-skipping-the-pie-in-adults-68-with-diabetes",
            "destination": "/articles/intermittent-socializing-postprandial-glucose",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-fermented-kefir-really-reduce-intestinal-permeability-driven-endotoxemia-in-adults-70-with-type-2-diabetes-and-recurrent-utis-separating-strain-specific-lactobacillus-effects-from-fructose-content",
            "destination": "/articles/kefir-endotoxemia-diabetes-seniors",
            "permanent": true
        },
        {
            "source": "/articles/best-travel-friendly-glucose-monitors-with-offline-data-sync-for-seniors-75-attending-multi-state-holiday-visits-accuracy-battery-life-and-grandchild-proof-interface-compared",
            "destination": "/articles/travel-glucose-monitor-seniors-offline-sync",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-pre-holiday-3-day-low-carb-reset-vs-same-duration-magnesium-glycinate-loading-which-better-stabilizes-heart-rate-variability-in-adults-58-with-subclinical-autonomic-dysfunction",
            "destination": "/articles/low-carb-vs-magnesium-holiday-heart-prevention",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-5-minute-morning-sunlight-exposure-through-uv-blocking-window-glass-vs-direct-outdoor-exposure-impact-on-circadian-bp-rhythm-reset-in-adults-70-with-shifted-melatonin-peaks",
            "destination": "/articles/sunlight-exposure-and-circadian-blood-pressure",
            "permanent": true
        },
        {
            "source": "/articles/5-things-everyone-over-75-should-know-about-continuous-glucose-monitoring-without-a-smartphone-including-manual-data-extraction-analog-alert-alternatives-and-battery-life-extension-hacks",
            "destination": "/articles/cgms-for-seniors-without-smartphones",
            "permanent": true
        },
        {
            "source": "/articles/5-science-backed-ways-to-protect-your-atria-while-hosting-holiday-guests-stress-modulated-nitric-oxide-bioavailability-microbreak-timing-and-vocal-cord-strain-reduction-in-adults-70",
            "destination": "/articles/hosting-holiday-guests-atrial-protection",
            "permanent": true
        },
        {
            "source": "/articles/12-foods-that-reduce-aortic-pulse-wave-velocity-without-lowering-diastolic-pressure-excessively-for-adults-64-with-isolated-systolic-hypertension-and-orthostatic-tendency",
            "destination": "/articles/foods-for-aortic-stiffness-without-orthostasis",
            "permanent": true
        },
        {
            "source": "/articles/10-foods-that-lower-central-systolic-pressure-while-supporting-cognitive-blood-flow-for-adults-66-with-white-matter-hyperintensities-and-mild-hypertension",
            "destination": "/articles/foods-for-central-bp-and-cognitive-blood-flow",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-sudden-heavy-legs-after-sitting-for-90-minutes-distinguishing-early-venous-stiffness-from-incipient-right-heart-strain-in-adults-60-74-with-sedentary-lifestyles",
            "destination": "/articles/heavy-legs-sitting-heart-strain-seniors",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-weekly-high-intensity-interval-training-hiit-only-on-tuesdays-mitochondrial-biogenesis-glycemic-variability-and-skeletal-muscle-capillarization-in-adults-71-with-sarcopenia-and-type-2-diabetes",
            "destination": "/articles/weekly-hiit-once-sarcopenia-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-intermittent-fasting-windows-before-cardiac-catheterization-impact-on-contrast-induced-nephropathy-risk-in-adults-71-with-ckd-stage-3",
            "destination": "/articles/intermittent-fasting-before-cardiac-catheterization",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-daily-4-minute-cold-water-face-immersion-before-evening-walks-effects-on-baroreflex-gain-and-post-exercise-blood-pressure-recovery-in-adults-67-with-isolated-systolic-hypertension",
            "destination": "/articles/cold-face-immersion-baroreflex-seniors",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-heart-healthy-whole-grain-cereals-marketed-to-seniors-why-92-trigger-postprandial-endothelial-dysfunction-despite-low-sugar-in-adults-64-with-metabolic-flexibility-decline",
            "destination": "/articles/whole-grain-cereal-endothelial-dysfunction",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-heart-healthy-granola-bars-marketed-to-seniors-why-91-contain-palmitic-acid-induced-endothelial-stiffness-in-adults-67-with-mild-hypertension",
            "destination": "/articles/heart-healthy-granola-bars-truth-for-seniors",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-interpreting-home-ecg-patch-data-without-a-cardiologist-spotting-pvc-burden-shifts-afib-paroxysms-and-sinus-node-dysfunction-in-adults-57-70",
            "destination": "/articles/home-ecg-patch-interpretation-for-seniors",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-coronary-microvascular-function-without-increasing-nitric-oxide-synthase-uncoupling-using-pomegranate-ellagitannins-low-dose-l-citrulline-timing-in-adults-60-67-with-inoca",
            "destination": "/articles/natural-support-for-coronary-microvascular-disease",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-dose-lithium-0-3-mg-day-affects-beta-cell-autophagy-and-mitochondrial-turnover-in-adults-59-67-with-long-standing-type-2-diabetes-a-2024-pilot-study-update",
            "destination": "/articles/low-dose-lithium-beta-cell-function",
            "permanent": true
        },
        {
            "source": "/articles/best-home-blood-pressure-cuffs-with-integrated-ecg-for-adults-78-with-atrial-fibrillation-and-severe-arthritis-accuracy-fit-and-rhythm-detection-compared",
            "destination": "/articles/home-bp-cuff-with-ecg-for-afib-seniors",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-traditional-roast-turkey-with-gravy-vs-herb-roasted-turkey-breast-with-mushroom-reduction-impact-on-postprandial-systolic-pressure-in-adults-62-with-isolated-systolic-hypertension",
            "destination": "/articles/turkey-preparation-postprandial-systolic-pressure",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-morning-3-minute-dynamic-ankle-circles-vs-evening-2-minute-seated-calf-squeezes-which-more-consistently-lowers-central-pulse-pressure-in-adults-71-with-high-aortic-stiffness",
            "destination": "/articles/ankle-circles-vs-calf-squeezes-pulse-pressure",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-daily-15-minute-tai-chi-qigong-vs-supervised-treadmill-walking-which-improves-6-minute-walk-distance-lv-diastolic-function-more-in-adults-69-with-hfpef",
            "destination": "/articles/tai-chi-vs-walking-for-hfpef-seniors",
            "permanent": true
        },
        {
            "source": "/articles/7-hidden-sodium-traps-in-healthy-holiday-side-dishes-why-roasted-sweet-potatoes-quinoa-salad-and-herb-infused-gravy-often-contain-420-mg-per-serving-for-adults-72-with-stage-2-hypertension",
            "destination": "/articles/hidden-sodium-holiday-side-dishes",
            "permanent": true
        },
        {
            "source": "/articles/7-hidden-medication-interactions-that-sabotage-glycemic-control-in-women-over-65-taking-aromatase-inhibitors-tamoxifen-letrozole-and-insulin-resistance-pathways",
            "destination": "/articles/aromatase-inhibitors-diabetes-interaction-seniors",
            "permanent": true
        },
        {
            "source": "/articles/7-hidden-heart-health-risks-of-long-term-statin-use-in-adults-65-with-polypharmacy-mitochondrial-coq10-depletion-skeletal-muscle-microtears-and-late-onset-fatigue-patterns",
            "destination": "/articles/statin-side-effects-heart-health-seniors",
            "permanent": true
        },
        {
            "source": "/articles/5-things-every-senior-living-alone-should-know-before-attending-their-first-post-pandemic-holiday-party-from-portion-control-to-social-glucose-triggers",
            "destination": "/articles/seniors-living-alone-holiday-party-preparedness",
            "permanent": true
        },
        {
            "source": "/articles/5-science-backed-ways-to-preserve-muscle-mass-while-eating-holiday-meals-leucine-timing-post-meal-walking-cadence-and-protein-distribution-for-adults-74-with-sarcopenia-risk",
            "destination": "/articles/preserve-muscle-mass-holiday-meals",
            "permanent": true
        },
        {
            "source": "/articles/why-your-blood-sugar-spikes-higher-after-a-holiday-dinner-at-your-daughter-s-house-the-role-of-emotional-eating-triggers-and-cortisol-enhanced-gluconeogenesis-in-adults-64",
            "destination": "/articles/holiday-dinner-blood-sugar-emotional-triggers",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-sudden-bp-drops-after-standing-during-physical-therapy-sessions-distinguishing-orthostatic-hypotension-from-early-cardiac-tamponade-in-adults-76-post-cabg",
            "destination": "/articles/bp-drop-physical-therapy-post-cabg",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-hosting-a-heart-healthy-holiday-dinner-while-managing-mild-cognitive-impairment-meal-prep-labeling-and-guest-communication-protocols-for-adults-77",
            "destination": "/articles/heart-healthy-holiday-dinner-mci-hosting",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-normalize-post-meal-urinary-albumin-to-creatinine-ratio-within-72-hours-using-targeted-evening-magnesium-glycinate-cold-water-hand-immersion-in-adults-67-with-microalbuminuria",
            "destination": "/articles/lower-albuminuria-quickly-seniors",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-neutralize-excess-holiday-sodium-within-20-minutes-using-targeted-potassium-rich-bite-sized-foods-and-post-meal-hydration-sequencing-in-adults-71-with-ckd-stage-3",
            "destination": "/articles/neutralize-holiday-sodium-quickly-seniors-ck",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-restore-circadian-rhythm-driven-insulin-secretion-without-melatonin-using-blue-light-filtered-evening-lenses-fixed-dose-zinc-carnosine-timing-in-adults-64-with-evening-hyperglycemia",
            "destination": "/articles/restore-insulin-rhythm-without-melatonin",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-modulate-cardiac-connexin-43-phosphorylation-without-increasing-oxidative-load-using-low-dose-resveratrol-time-restricted-feeding-in-adults-63-with-intermittent-pacs",
            "destination": "/articles/connexin-43-phosphorylation-natural-modulation",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-i-ll-just-skip-breakfast-to-save-calories-for-dinner-how-fasting-induced-hyperglycemia-and-cortisol-surges-worsen-holiday-glucose-control-in-adults-67",
            "destination": "/articles/skipping-breakfast-holiday-hyperglycemia-seniors",
            "permanent": true
        },
        {
            "source": "/articles/how-holiday-travel-stress-alters-gut-microbiome-diversity-in-adults-58-with-irritable-bowel-syndrome-and-what-to-eat-on-the-plane-to-minimize-dysbiosis",
            "destination": "/articles/holiday-travel-gut-microbiome-ibs-seniors",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-nighttime-mouth-breathing-alters-left-ventricular-filling-pressure-evidence-from-cardiac-mri-in-adults-58-72-with-untreated-mild-sleep-disordered-breathing",
            "destination": "/articles/mouth-breathing-diastolic-dysfunction-seniors",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-1-000-iu-vitamin-d3-supplementation-really-improve-left-atrial-strain-in-adults-65-with-subclinical-hypovitaminosis-d-and-preserved-ejection-fraction",
            "destination": "/articles/vitamin-d-left-atrial-strain-seniors",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-traditional-slow-cooked-turkey-breast-vs-sous-vide-turkey-breast-impact-on-advanced-glycation-end-products-ages-postprandial-inflammation-and-endothelial-function-in-adults-66-with-early-atherosclerosis",
            "destination": "/articles/turkey-cooking-method-endothelial-health",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-12-week-time-restricted-eating-starting-at-6-a-m-vs-10-a-m-impact-on-fasting-triglycerides-hepatic-fat-fraction-and-postprandial-glp-1-in-adults-55-62-with-nafld-and-prediabetes",
            "destination": "/articles/trf-window-timing-nafld-prediabetes",
            "permanent": true
        },
        {
            "source": "/articles/12-medication-adjustments-you-should-discuss-with-your-pharmacist-before-starting-a-community-garden-especially-if-you-re-60-with-diabetes-peripheral-neuropathy-and-topical-nsaid-use",
            "destination": "/articles/gardening-diabetes-medication-safety",
            "permanent": true
        },
        {
            "source": "/articles/12-foods-that-support-cardiac-fibroblast-quiescence-without-activating-tgf-signaling-for-adults-59-68-with-early-diastolic-stiffness-and-normal-ejection-fraction",
            "destination": "/articles/foods-cardiac-fibroblast-quiescence-seniors",
            "permanent": true
        },
        {
            "source": "/articles/why-your-fingertip-blood-glucose-readings-spike-after-a-hot-shower-thermal-vasodilation-capillary-shunting-and-delayed-insulin-absorption-in-adults-72-with-long-term-type-2-diabetes",
            "destination": "/articles/hot-shower-blood-sugar-spike-seniors",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-sudden-dry-eyes-and-blurred-vision-after-age-63-distinguishing-sj-gren-s-associated-lacrimal-gland-dysfunction-from-early-diabetic-retinal-neurodegeneration",
            "destination": "/articles/dry-eyes-blurred-vision-diabetes-seniors",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-sudden-bloating-after-thanksgiving-dinner-distinguishing-food-intolerance-from-early-small-intestinal-bacterial-overgrowth-sibo-in-adults-63-with-long-term-ppi-use",
            "destination": "/articles/sudden-bloating-after-holiday-dinner",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-strategic-snacking-before-holiday-gatherings-preemptive-protein-fiber-dosing-to-modulate-ghrelin-glp-1-and-gastric-emptying-in-adults-57-64-with-obesity-related-insulin-resistance",
            "destination": "/articles/strategic-snacking-before-holiday-gatherings",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-3-minute-cold-water-hand-immersion-before-morning-blood-pressure-checks-impact-on-cuff-accuracy-in-adults-73-with-peripheral-artery-disease",
            "destination": "/articles/cold-water-hand-immersion-bp-accuracy",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-earliest-signs-of-diabetic-gastroparesis-in-men-over-60-before-nausea-or-vomiting-appear-detecting-gastric-slow-wave-dysrhythmia-via-wearable-egg-and-breath-hydrogen-profiling",
            "destination": "/articles/early-gastroparesis-signs-men-seniors",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-well-controlled-a1c-is-masking-severe-nocturnal-hypoglycemia-even-with-normal-cgm-time-in-range-in-adults-68-on-once-daily-glp-1-agonists",
            "destination": "/articles/nocturnal-hypoglycemia-masked-a1c",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-sugar-free-desserts-labeled-for-seniors-why-erythritol-only-formulations-still-disrupt-gut-microbiota-derived-butyrate-in-adults-69-with-metabolic-syndrome",
            "destination": "/articles/sugar-free-desserts-gut-health-seniors",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-no-sugar-added-canned-soups-marketed-to-seniors-why-83-contain-hidden-sodium-induced-sympathetic-activation-and-nighttime-glucose-spikes-in-adults-69-with-hypertension",
            "destination": "/articles/no-sugar-added-soup-sodium-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-managing-diabetes-while-living-in-a-senior-cohousing-community-meal-planning-coordination-shared-cgm-alerts-and-emergency-response-protocols-for-adults-73",
            "destination": "/articles/diabetes-management-senior-cohousing",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-counteract-post-exercise-systolic-surge-within-90-seconds-using-targeted-supine-ankle-pumps-and-diaphragmatic-breath-stacking-in-adults-64-with-lvh",
            "destination": "/articles/post-exercise-systolic-surge-quick-fix",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-pancreatic-ductal-cell-integrity-without-increasing-fluid-secretion-using-curcumin-nanoparticles-taurine-timing-in-adults-63-with-type-2-diabetes-and-chronic-pancreatitis",
            "destination": "/articles/pancreatic-ductal-health-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-pancreatic-beta-cell-resilience-during-festive-eating-using-post-meal-fenugreek-seed-infusion-cold-pressed-flax-oil-timing-in-adults-61-with-long-standing-type-2-diabetes",
            "destination": "/articles/pancreatic-beta-cell-resilience-festive-eating",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-enhance-carotid-baroreceptor-sensitivity-without-medication-using-daily-2-minute-neck-cooling-submaximal-isometric-jaw-clenching-in-adults-60-68",
            "destination": "/articles/carotid-baroreceptor-sensitivity-cooling",
            "permanent": true
        },
        {
            "source": "/articles/how-untreated-hearing-loss-alters-cortical-glucose-utilization-patterns-and-why-that-accelerates-cognitive-decline-in-adults-65-with-diabetes-and-mild-mci",
            "destination": "/articles/hearing-loss-diabetes-cognitive-decline",
            "permanent": true
        },
        {
            "source": "/articles/how-seasonal-decline-in-vitamin-d-binding-protein-alters-free-25-oh-d-bioavailability-and-why-that-accelerates-insulin-resistance-in-adults-57-65-with-winter-onset-fatigue",
            "destination": "/articles/vitamin-d-binding-protein-winter-insulin",
            "permanent": true
        },
        {
            "source": "/articles/how-holiday-stress-hormones-sabotage-blood-sugar-control-during-family-dinners-cortisol-induced-insulin-resistance-patterns-in-adults-58-65-with-prediabetes",
            "destination": "/articles/holiday-stress-blood-sugar-control",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-dose-proton-pump-inhibitor-use-alters-gut-microbial-bile-acid-metabolism-and-why-that-worsens-postprandial-glucose-variability-in-adults-58-66-with-prediabetes",
            "destination": "/articles/pills-that-raise-blood-sugar-silently",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-2-gram-magnesium-glycinate-really-reduce-central-aortic-systolic-pressure-in-adults-62-with-high-pulse-wave-velocity-new-data-from-the-mag-cap-trial",
            "destination": "/articles/magnesium-glycinate-central-aortic-pressure",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-morning-10-minute-dynamic-stretching-vs-evening-8-minute-guided-breath-hold-sequencing-which-better-lowers-nocturnal-systolic-in-adults-69-with-non-dipping-patterns",
            "destination": "/articles/morning-stretching-vs-breath-hold-nocturnal-bp",
            "permanent": true
        },
        {
            "source": "/articles/12-foods-that-support-endothelial-nitric-oxide-synthase-activity-without-increasing-homocysteine-for-adults-57-66-with-mild-hypertension-and-mthfr-polymorphisms",
            "destination": "/articles/enos-foods-mthfr-polymorphism-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/why-your-cgm-alarms-are-less-reliable-during-holiday-travel-sensor-accuracy-drift-from-altitude-humidity-and-checked-luggage-temperature-swings-in-adults-66-with-frequent-air-travel",
            "destination": "/articles/cgm-accuracy-holiday-travel",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-unexplained-fatigue-after-holiday-dinners-distinguishing-postprandial-hypotension-from-early-autonomic-neuropathy-in-adults-70-with-diabetes",
            "destination": "/articles/fatigue-after-meals-diabetes-elderly",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-sudden-midday-fatigue-after-age-64-distinguishing-hypoglycemia-associated-autonomic-failure-from-early-mitochondrial-myopathy-in-long-term-diabetes",
            "destination": "/articles/midday-fatigue-diabetes-autonomic-failure-seniors",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-time-restricted-eating-starting-at-4-p-m-for-adults-67-with-type-2-diabetes-and-early-diastolic-dysfunction-impact-on-cardiac-strain-and-nt-probnp-trajectories",
            "destination": "/articles/time-restricted-eating-4pm-type-2-diabetes-seniors",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-intermittent-fasting-only-on-weekdays-during-the-holidays-glycemic-outcomes-muscle-preservation-and-appetite-hormone-shifts-in-adults-68-with-sarcopenic-obesity",
            "destination": "/articles/weekday-intermittent-fasting-holidays",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-gluten-free-stuffing-mixes-marketed-to-seniors-why-62-contain-hidden-maltodextrin-induced-glycemic-surges-in-adults-67-with-insulin-resistance",
            "destination": "/articles/gluten-free-stuffing-glycemic-impact",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-managing-diabetes-while-caring-for-a-spouse-with-dementia-practical-strategies-for-medication-adherence-meal-timing-conflicts-and-cgm-data-sharing-in-adults-66",
            "destination": "/articles/diabetes-management-dementia-caregiver-seniors",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-reduce-postprandial-triglyceride-spikes-within-20-minutes-using-targeted-post-meal-isometric-calf-contractions-and-cold-water-face-immersion-in-adults-61-with-mixed-dyslipidemia-and-diabetes",
            "destination": "/articles/reduce-postprandial-triglycerides-quickly-seniors",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-reduce-post-holiday-hba1c-without-weight-loss-using-3-day-postprandial-glucose-reset-protocols-in-adults-60-71-with-stable-bmi-and-elevated-a1c",
            "destination": "/articles/reduce-hba1c-without-weight-loss",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-hepatic-mitochondrial-biogenesis-without-activating-mtor-using-berberine-urolithin-a-in-adults-65-with-nafld-and-type-2-diabetes",
            "destination": "/articles/hepatic-mitochondrial-biogenesis-berberine-seniors",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-stabilize-cardiac-autonomic-tone-without-beta-blockers-using-morning-sunlight-exposure-slow-movement-breathing-in-adults-59-with-early-vagal-withdrawal",
            "destination": "/articles/natural-autonomic-stabilization-holiday-heart",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-maintain-gut-barrier-integrity-during-holiday-feasting-using-l-glutamine-timing-fermented-beetroot-and-low-heat-sauerkraut-in-adults-62-with-leaky-gut-markers",
            "destination": "/articles/gut-barrier-holiday-feasting",
            "permanent": true
        },
        {
            "source": "/articles/how-persistent-nighttime-cough-in-adults-69-with-type-2-diabetes-and-mild-asthma-may-signal-early-diabetic-autonomic-neuropathy-not-just-gerd-or-postnasal-drip",
            "destination": "/articles/nighttime-cough-diabetic-autonomic-neuropathy",
            "permanent": true
        },
        {
            "source": "/articles/does-cranberry-juice-really-worsen-blood-glucose-control-in-adults-71-with-diabetes-and-recurrent-utis-separating-proanthocyanidin-benefits-from-fructose-driven-endotoxin-translocation",
            "destination": "/articles/cranberry-juice-blood-glucose-control",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-daily-5-minute-vagus-nerve-stimulation-vns-vs-evening-tart-cherry-juice-which-better-reduces-nighttime-afib-burden-in-adults-64-with-nocturnal-hypertension",
            "destination": "/articles/vns-vs-tart-cherry-juice-nocturnal-afib",
            "permanent": true
        },
        {
            "source": "/articles/5-things-everyone-over-70-should-know-about-sulfonylurea-use-especially-if-you-re-taking-gliclazide-and-have-age-related-decline-in-cyp2c9-and-renal-function",
            "destination": "/articles/sulfonylurea-use-over-70-cyp2c9-decline",
            "permanent": true
        },
        {
            "source": "/articles/5-science-backed-ways-to-stabilize-blood-glucose-during-christmas-morning-using-timing-temperature-and-texture-adjustments-for-adults-60-69-with-insulin-treated-diabetes",
            "destination": "/articles/stabilize-blood-glucose-christmas-morning",
            "permanent": true
        },
        {
            "source": "/articles/5-foods-that-support-pancreatic-acinar-cell-repair-without-stimulating-exocrine-hypersecretion-for-adults-58-67-with-type-2-diabetes-and-chronic-pancreatitis-history",
            "destination": "/articles/pancreatic-acinar-repair-foods-type-2-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/12-medication-adjustments-you-should-discuss-with-your-doctor-before-starting-a-walking-group-especially-if-you-re-63-with-type-2-diabetes-mild-ckd-and-diuretic-use",
            "destination": "/articles/diabetes-medication-walking-group-seniors-ckda",
            "permanent": true
        },
        {
            "source": "/articles/10-things-everyone-over-65-should-know-about-managing-diabetes-while-caring-for-a-spouse-with-dementia-medication-safety-meal-coordination-and-emergency-preparedness",
            "destination": "/articles/diabetes-management-dementia-caregiver",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-post-dinner-palpitations-during-hanukkah-or-christmas-red-flags-that-distinguish-holiday-heart-syndrome-from-benign-pacs-in-adults-58-74",
            "destination": "/articles/post-dinner-palpitations-holiday-heart-syndrome",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-magnesium-glycinate-timing-relative-to-holiday-desserts-optimizing-absorption-arrhythmia-protection-in-adults-65-with-gastric-hypochlorhydria",
            "destination": "/articles/magnesium-glycinate-holiday-dessert-timing",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-holiday-heart-syndrome-is-actually-early-stage-cardiac-amyloidosis-especially-if-you-re-over-75-and-have-carpal-tunnel-or-lumbar-spinal-stenosis",
            "destination": "/articles/holiday-palpitations-cardiac-amyloidosis-red-flags",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-safe-holiday-baking-with-sulfonylureas-avoiding-hypoglycemia-triggers-from-leavening-agents-yeast-fermentation-byproducts-and-oven-heat-stress",
            "destination": "/articles/holiday-baking-sulfonylureas-safety",
            "permanent": true
        },
        {
            "source": "/articles/simple-steps-to-normalize-fasting-glucose-without-skipping-dinner-using-sequential-pre-bed-protein-fat-snacking-and-nasal-breathing-during-sleep-in-adults-60-73",
            "destination": "/articles/normalize-fasting-glucose-without-skipping-dinner",
            "permanent": true
        },
        {
            "source": "/articles/science-backed-ways-to-reverse-early-diabetic-retinopathy-without-laser-or-anti-vegf-using-targeted-flavonoid-bioavailability-and-retinal-capillary-pericyte-protection-in-adults-58-67",
            "destination": "/articles/reverse-early-diabetic-retinopathy-naturally",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-beta-cell-resilience-during-high-carb-holiday-eating-using-polyphenol-timing-cold-exposure-windows-and-breath-hold-protocols-in-adults-57-65-with-recent-onset-type-2-diabetes",
            "destination": "/articles/beta-cell-resilience-holiday-eating",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-improve-insulin-receptor-tyrosine-kinase-activity-without-increasing-oxidative-burden-using-low-dose-lithium-orotate-alpha-lipoic-acid-in-adults-65-with-long-standing-diabetes-and-elevated-8-ohdg",
            "destination": "/articles/insulin-receptor-kinase-natural-activation-seniors",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-my-heart-is-strong-because-i-climb-stairs-easily-what-stress-echocardiography-reveals-about-subclinical-ischemia-in-adults-55-64-with-family-history",
            "destination": "/articles/stairs-fitness-and-subclinical-ischemia",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-i-can-eat-anything-if-i-take-extra-insulin-real-world-outcomes-in-adults-59-67-with-long-term-t2d-using-correction-factor-overuse-during-holidays",
            "destination": "/articles/insulin-overcorrection-holiday-myth",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-eating-late-causes-diabetes-what-chronobiology-research-actually-shows-about-meal-timing-insulin-sensitivity-and-clock-gene-methylation-in-adults-57-65",
            "destination": "/articles/late-eating-diabetes-myths-chronobiology-seniors",
            "permanent": true
        },
        {
            "source": "/articles/how-late-afternoon-sunlight-exposure-regulates-hepatic-gluconeogenic-gene-expression-in-adults-60-71-with-type-2-diabetes-via-melanopsin-dependent-scn-signaling-not-vitamin-d",
            "destination": "/articles/afternoon-sunlight-gluconeogenesis-type-2-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/how-cold-weather-indoor-air-dryness-alters-nasal-mucosal-glucose-absorption-and-why-that-affects-fasting-glucose-readings-in-adults-74-with-type-1-diabetes",
            "destination": "/articles/dry-air-fasting-glucose-accuracy",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-use-of-a-far-infrared-sauna-improve-skeletal-muscle-glucose-uptake-in-adults-72-with-type-2-diabetes-and-sarcopenia-evidence-from-12-week-rct-using-hyperinsulinemic-euglycemic-clamp",
            "destination": "/articles/far-infrared-sauna-glucose-uptake-seniors-sarcopenia",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-use-a-portable-oxygen-concentrator-during-cardiac-rehab-sessions-safety-thresholds-for-spo-hrv-and-exercise-tolerance-in-adults-71-with-hfpef",
            "destination": "/articles/oxygen-concentrator-during-cardiac-rehab",
            "permanent": true
        },
        {
            "source": "/articles/best-non-alcoholic-wine-alternatives-for-adults-75-with-diabetes-and-early-macular-degeneration-balancing-resveratrol-bioavailability-sugar-content-and-blue-light-filtering-potential",
            "destination": "/articles/non-alcoholic-wine-diabetes-macular-degeneration",
            "permanent": true
        },
        {
            "source": "/articles/best-footwear-modifications-for-adults-64-with-type-2-diabetes-and-early-charcot-neuroarthropathy-custom-rocker-soles-vs-off-the-shelf-diabetic-shoes-for-reducing-midfoot-pressure-peaks",
            "destination": "/articles/charcot-neuroarthropathy-footwear-seniors",
            "permanent": true
        },
        {
            "source": "/articles/best-breathing-techniques-for-reducing-left-atrial-pressure-without-valsalva-evidence-based-paced-respiration-protocols-for-adults-73-with-paroxysmal-afib-and-mild-pulmonary-hypertension",
            "destination": "/articles/breathing-techniques-for-left-atrial-pressure",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-walking-the-mall-for-20-minutes-after-dinner-vs-standing-while-wrapping-gifts-which-lowers-2-hour-postprandial-glucose-more-in-adults-72-with-peripheral-neuropathy",
            "destination": "/articles/walking-vs-standing-post-dinner-glucose",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-continuous-glucose-monitoring-with-real-time-alerts-vs-intermittent-flash-glucose-monitoring-for-preventing-nocturnal-hypoglycemia-in-adults-75-with-nocturnal-hypoglycemia-associated-autonomic-failure",
            "destination": "/articles/cgms-vs-flash-glucose-monitoring-seniors-hypoglycemia",
            "permanent": true
        },
        {
            "source": "/articles/12-hidden-sources-of-sodium-in-holiday-meals-that-worsen-insulin-resistance-especially-for-adults-55-64-with-stage-1-hypertension-and-newly-diagnosed-diabetes",
            "destination": "/articles/hidden-sodium-holiday-meals-insulin-resistance",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-intermittent-palpitations-during-morning-yoga-distinguishing-benign-pvc-clusters-from-early-rvot-vt-in-adults-61-with-mild-pulmonary-hypertension",
            "destination": "/articles/palpitations-during-yoga-rvot-vt",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-heart-healthy-seed-oils-marketed-to-seniors-why-high-linoleic-safflower-and-sunflower-oils-may-promote-endothelial-oxidative-stress-in-adults-64-with-elevated-lp-a",
            "destination": "/articles/seed-oils-and-endothelial-oxidative-stress",
            "permanent": true
        },
        {
            "source": "/articles/the-dangers-of-overcorrecting-normal-fasting-glucose-in-adults-82-with-mild-cognitive-impairment-why-90-mg-dl-may-increase-fall-risk-and-delirium-episodes",
            "destination": "/articles/overcorrecting-fasting-glucose-oldest-old",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-managing-diabetes-during-winter-power-outages-food-storage-insulin-refrigeration-alternatives-and-cgm-battery-survival-for-adults-65-in-rural-areas",
            "destination": "/articles/diabetes-management-winter-power-outage",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-managing-blood-pressure-during-long-haul-flights-practical-strategies-for-adults-68-with-mild-ckd-and-mild-orthostatic-intolerance",
            "destination": "/articles/blood-pressure-on-long-haul-flights-seniors",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-normalize-postprandial-glucose-spikes-within-45-minutes-using-sequential-protein-first-eating-isometric-handgrip-and-nasal-breathing-in-adults-60-68",
            "destination": "/articles/normalize-postprandial-glucose-within-45-minutes",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-mitochondrial-quality-control-in-cardiomyocytes-without-activating-mtor-using-fasting-mimicking-diets-and-urolithin-a-in-adults-66-with-preserved-ef-and-low-vo-peak",
            "destination": "/articles/mitochondrial-quality-control-in-cardiomyocytes",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-maintain-gastric-acid-secretion-without-ppis-during-holiday-feasting-using-betaine-hcl-timing-zinc-carnosine-in-adults-64-with-atrophic-gastritis",
            "destination": "/articles/gastric-acid-support-without-ppi-seniors",
            "permanent": true
        },
        {
            "source": "/articles/how-living-near-high-traffic-urban-corridors-alters-autonomic-modulation-of-ventricular-repolarization-in-adults-57-65-with-borderline-qtc-prolongation",
            "destination": "/articles/traffic-pollution-and-ventricular-repolarization",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-use-of-a-heated-massage-pillow-on-the-upper-trapezius-reduce-morning-systolic-surges-in-adults-59-65-with-chronic-tension-headaches-and-mild-anxiety",
            "destination": "/articles/heated-massage-pillow-and-morning-blood-pressure",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-take-magnesium-threonate-while-on-a-beta-blocker-safety-thresholds-qt-interval-monitoring-and-cognitive-benefits-in-adults-71-with-mild-heart-failure",
            "destination": "/articles/magnesium-threonate-beta-blocker-safety",
            "permanent": true
        },
        {
            "source": "/articles/best-walking-surfaces-for-adults-69-with-diabetic-foot-ulcers-in-remission-concrete-asphalt-gravel-or-grass-evidence-based-impact-on-plantar-pressure-redistribution",
            "destination": "/articles/best-walking-surfaces-diabetic-foot-ulcers",
            "permanent": true
        },
        {
            "source": "/articles/5-foods-that-support-cardiac-fibroblast-quiescence-without-suppressing-collagen-turnover-for-adults-70-with-early-diastolic-dysfunction-and-normal-troponin",
            "destination": "/articles/foods-for-cardiac-fibroblast-quiescence",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-sudden-nighttime-hunger-that-wakes-you-up-differentiating-reactive-hypoglycemia-nocturnal-somogyi-effect-and-early-autonomic-failure-in-adults-70",
            "destination": "/articles/sudden-nighttime-hunger-diabetes-diagnosis",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-normal-troponin-i-levels-after-a-fall-understanding-age-adjusted-cutoffs-and-myocardial-contusion-risk-in-adults-82-with-osteoporosis",
            "destination": "/articles/troponin-after-fall-in-elderly",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-earliest-blood-biomarkers-of-pancreatic-beta-cell-stress-before-fasting-glucose-rises-for-adults-52-59-with-strong-family-history-and-normal-weight",
            "destination": "/articles/earliest-biomarkers-beta-cell-stress",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-home-blood-pressure-monitor-is-giving-false-low-readings-due-to-arm-cuff-misalignment-especially-if-you-have-lymphedema-or-post-mastectomy-swelling",
            "destination": "/articles/false-low-blood-pressure-readings-lymphedema",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-heart-healthy-omega-3-supplements-marketed-to-seniors-why-82-fail-to-deliver-epa-dha-in-bioavailable-form-due-to-oxidation-and-enteric-coating-defects",
            "destination": "/articles/omega-3-supplement-bioavailability-seniors",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-heart-healthy-frozen-dinners-marketed-to-seniors-why-74-contain-hidden-sodium-potassium-imbalance-triggers-in-adults-78-with-mild-diastolic-dysfunction",
            "destination": "/articles/frozen-dinners-and-blood-pressure-seniors",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-salivary-amylase-activity-without-increasing-carbohydrate-load-using-chilled-cucumber-ribbons-and-zinc-enhanced-herbs-in-adults-70-with-dry-mouth-and-dysphagia",
            "destination": "/articles/salivary-amylase-support-dry-mouth-elderly",
            "permanent": true
        },
        {
            "source": "/articles/how-living-near-high-traffic-urban-corridors-alters-carotid-intima-media-thickness-progression-in-adults-66-with-controlled-hypertension-and-no-prior-cvd",
            "destination": "/articles/traffic-pollution-carotid-thickness-progression",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-grade-dental-inflammation-alters-endothelial-glycocalyx-thickness-and-why-that-matters-for-microvascular-coronary-flow-reserve-in-adults-64-with-stable-angina",
            "destination": "/articles/dental-inflammation-coronary-microvascular-flow",
            "permanent": true
        },
        {
            "source": "/articles/5-things-every-man-over-74-should-know-about-testosterone-deficiency-and-its-impact-on-skeletal-muscle-glucose-uptake-especially-with-concurrent-statin-use",
            "destination": "/articles/testosterone-deficiency-muscle-glucose-uptake-men",
            "permanent": true
        },
        {
            "source": "/articles/10-hidden-sources-of-arsenic-exposure-in-well-water-dependent-senior-communities-and-how-low-dose-chronic-exposure-may-accelerate-vascular-calcification-in-adults-67",
            "destination": "/articles/arsenic-exposure-and-vascular-calcification",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-sudden-fatigue-after-dinner-at-your-daughter-s-house-linking-postprandial-hypotension-autonomic-testing-and-family-meal-timing-in-adults-76",
            "destination": "/articles/post-dinner-fatigue-orthostatic-hypotension",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-a-single-elevated-reading-after-cataract-surgery-understanding-transient-sympathetic-surge-patterns-in-adults-75-with-preexisting-white-coat-hypertension",
            "destination": "/articles/blood-pressure-after-cataract-surgery-seniors",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-earliest-signs-of-arterial-stiffness-before-bp-rises-especially-in-women-over-63-with-a-history-of-preeclampsia-and-now-on-aromatase-inhibitors",
            "destination": "/articles/arterial-stiffness-signs-after-preeclampsia",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-diabetic-friendly-protein-bars-marketed-to-seniors-why-68-contain-hidden-maltodextrin-propylene-glycol-esters-that-disrupt-gut-barrier-integrity",
            "destination": "/articles/diabetic-protein-bars-gut-barrier-risk",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-renal-tubular-sodium-excretion-without-diuretics-using-targeted-tart-cherry-anthocyanins-hydration-timing-in-adults-68-with-mild-volume-expansion-and-egfr-58",
            "destination": "/articles/natural-sodium-excretion-without-diuretics",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-enhance-hepatic-insulin-clearance-without-cyp3a4-induction-using-time-restricted-feeding-and-evening-magnesium-glycinate-in-adults-66-with-nafld-and-t2d",
            "destination": "/articles/enhance-hepatic-insulin-clearance-natural",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-my-blood-pressure-is-fine-because-it-s-normal-at-the-doctor-s-office-what-ambulatory-monitoring-reveals-about-masked-hypertension-in-adults-55-64-with-high-job-stress",
            "destination": "/articles/masked-hypertension-job-stress-adults-55-64",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-i-don-t-need-eye-exams-because-my-vision-is-fine-what-oct-angiography-reveals-about-early-retinal-capillary-dropout-in-adults-61-with-8-year-t2d-history",
            "destination": "/articles/diabetic-retinopathy-oct-angiography-myths",
            "permanent": true
        },
        {
            "source": "/articles/how-long-term-use-of-over-the-counter-nasal-decongestants-alters-carotid-sinus-sensitivity-in-adults-64-with-early-autonomic-neuropathy-and-mild-orthostasis",
            "destination": "/articles/nasal-decongestants-and-carotid-sinus-sensitivity",
            "permanent": true
        },
        {
            "source": "/articles/how-intermittent-fasting-14-10-window-affects-circadian-clock-gene-expression-in-the-adrenal-cortex-and-why-that-matters-for-bp-rhythmicity-in-adults-62-with-mild-adrenal-insufficiency",
            "destination": "/articles/intermittent-fasting-and-adrenal-blood-pressure",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-exposure-to-low-frequency-vibration-e-g-from-walking-aids-or-mobility-scooters-alters-baroreflex-sensitivity-in-adults-79-with-severe-peripheral-neuropathy",
            "destination": "/articles/low-frequency-vibration-and-baroreflex-seniors",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-use-a-sauna-while-taking-an-ace-inhibitor-evidence-based-temperature-thresholds-and-recovery-protocols-for-adults-65-with-mild-lv-hypertrophy",
            "destination": "/articles/sauna-use-with-ace-inhibitors-seniors",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-resume-morning-tai-chi-after-starting-glp-1-agonists-evidence-based-timing-hydration-and-orthostatic-monitoring-protocols-for-adults-59-71",
            "destination": "/articles/tai-chi-after-starting-glp-1-agonists",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-morning-sunlight-exposure-before-10-am-vs-evening-blue-light-blocking-lenses-for-nocturnal-systolic-control-in-adults-63-with-mild-circadian-phase-delay",
            "destination": "/articles/morning-sunlight-vs-blue-light-blocking-seniors",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-continuous-glucose-monitoring-cgm-vs-structured-self-monitoring-of-blood-glucose-smbg-for-detecting-dawn-phenomenon-in-adults-57-64-with-early-beta-cell-decline",
            "destination": "/articles/cgm-vs-smb-g-dawn-phenomenon-detection",
            "permanent": true
        },
        {
            "source": "/articles/5-foods-that-support-endothelial-nitric-oxide-bioavailability-without-increasing-dietary-nitrates-for-adults-66-with-gastric-atrophy-and-low-intrinsic-factor",
            "destination": "/articles/endothelial-support-without-nitrates-seniors",
            "permanent": true
        },
        {
            "source": "/articles/10-hidden-sources-of-endocrine-disrupting-chemicals-in-senior-living-communities-and-how-they-may-amplify-insulin-resistance-in-adults-77-with-long-term-t2d",
            "destination": "/articles/endocrine-disruptors-senior-living-insulin-resistance",
            "permanent": true
        },
        {
            "source": "/articles/why-your-holiday-glucose-readings-are-higher-only-when-visiting-your-son-s-house-the-role-of-pet-dander-induced-systemic-inflammation-in-adults-66-with-subclinical-asthma-and-t2d",
            "destination": "/articles/pet-dander-holiday-glucose-spikes",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-earliest-signs-your-blood-pressure-monitor-is-causing-subclinical-skin-microtrauma-and-why-that-accelerates-endothelial-dysfunction-in-adults-77-with-thin-fragile-skin",
            "destination": "/articles/blood-pressure-cuff-skin-microtrauma-endothelial-dysfunction",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-sugar-free-holiday-candies-marketed-to-seniors-why-83-contain-maltitol-induced-osmotic-diarrhea-and-secondary-hyperglycemia-in-adults-69-with-gastroparesis",
            "destination": "/articles/sugar-free-candies-and-gastroparesis",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-low-sodium-canned-soups-marketed-to-seniors-why-83-contain-unlabeled-potassium-chloride-blends-that-trigger-hyperkalemic-bradycardia-in-adults-76-with-ckd-stage-3",
            "destination": "/articles/low-sodium-soup-potassium-chloride-ckdseniors",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-managing-diabetes-during-intergenerational-holiday-hosting-practical-strategies-for-adults-61-74-with-mild-cognitive-load-and-caregiver-fatigue",
            "destination": "/articles/diabetes-management-intergenerational-hosting",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-postprandial-glucose-clearance-without-increasing-insulin-dose-using-post-meal-walking-intensity-gradients-and-diaphragmatic-breath-timing-in-adults-64-with-mild-ckd",
            "destination": "/articles/natural-postprandial-glucose-control-kidney-disease",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-nighttime-nitric-oxide-synthase-activity-without-nitrates-using-topical-beetroot-gel-and-supine-nasal-breathing-in-adults-67-with-non-dipping-bp-pattern",
            "destination": "/articles/nocturnal-nitric-oxide-beetroot-gel-nasal-breathing",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-cardiac-sodium-potassium-pump-resilience-without-increasing-dietary-potassium-using-targeted-magnesium-l-threonate-cold-air-nasal-breathing-in-adults-66-with-diuretic-induced-hypokalemia",
            "destination": "/articles/sodium-potassium-pump-resilience-natural",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-stable-heart-disease-means-no-progression-what-2024-imaging-studies-reveal-about-silent-plaque-erosion-in-adults-58-66-with-controlled-bp-and-ldl",
            "destination": "/articles/stable-heart-disease-plaque-erosion",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-salt-sensitivity-in-older-adults-what-new-research-says-about-genetic-variants-gut-microbiome-diversity-and-dietary-sodium-thresholds-in-adults-69",
            "destination": "/articles/salt-sensitivity-myths-older-adults-gut-microbiome",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-i-can-skip-my-medication-just-this-one-day-during-the-holidays-risks-for-adults-70-with-long-term-metformin-use-and-vitamin-b12-deficiency",
            "destination": "/articles/holiday-metformin-skipping-risks",
            "permanent": true
        },
        {
            "source": "/articles/how-late-afternoon-tea-consumption-especially-with-stevia-citric-acid-alters-renal-sodium-reabsorption-in-adults-73-with-thiazide-induced-hypokalemia-and-mild-volume-depletion",
            "destination": "/articles/tea-stevia-citric-acid-renal-sodium-reabsorption",
            "permanent": true
        },
        {
            "source": "/articles/how-holiday-light-displays-affect-evening-melatonin-onset-and-nocturnal-glucose-homeostasis-in-adults-68-with-shift-work-history-and-mild-sleep-fragmentation",
            "destination": "/articles/holiday-lights-melatonin-glucose",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-use-of-low-blue-light-evening-lamps-alters-melatonin-mediated-renin-release-and-why-that-elevates-early-morning-systolic-pressure-in-adults-64-with-mild-sleep-onset-insomnia",
            "destination": "/articles/low-blue-light-lamps-renin-morning-systolic-pressure",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-8-minute-guided-imagery-before-morning-medication-dose-reduce-pre-dose-systolic-surges-in-adults-59-65-with-white-coat-amplification-and-mild-anxiety",
            "destination": "/articles/guided-imagery-pre-dose-systolic-surge",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-use-warm-holiday-baths-while-taking-sglt2-inhibitors-evidence-based-water-temperature-thresholds-and-hydration-protocols-for-adults-63-with-mild-orthostasis",
            "destination": "/articles/warm-baths-sglt2-inhibitors-safety",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-enjoy-a-single-glass-of-mulled-wine-after-taking-your-evening-beta-blocker-evidence-based-timing-thresholds-for-adults-59-with-controlled-hypertension-and-normal-lvef",
            "destination": "/articles/beta-blocker-mulled-wine-timing",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-slow-paced-breathing-at-5-5-breaths-minute-vs-6-0-breaths-minute-for-acute-diastolic-pressure-reduction-in-adults-60-64-with-early-lv-diastolic-dysfunction",
            "destination": "/articles/resonant-breathing-diastolic-pressure-reduction",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-home-finger-cuff-photoplethysmography-vs-wrist-worn-ecg-for-detecting-paroxysmal-atrial-fibrillation-in-adults-79-with-severe-osteoarthritis-and-limited-dexterity",
            "destination": "/articles/finger-cuff-vs-wrist-ecg-afib-detection",
            "permanent": true
        },
        {
            "source": "/articles/7-hidden-stressors-in-holiday-gift-wrapping-that-elevate-sympathetic-tone-and-why-that-triggers-atrial-ectopy-in-adults-62-with-early-autonomic-imbalance",
            "destination": "/articles/holiday-stress-and-atrial-ectopy",
            "permanent": true
        },
        {
            "source": "/articles/5-foods-that-lower-central-aortic-systolic-pressure-without-reducing-brachial-diastolic-for-adults-70-with-wide-pulse-pressure-and-mild-cognitive-impairment",
            "destination": "/articles/central-aortic-pressure-foods-wide-pulse-pressure",
            "permanent": true
        },
        {
            "source": "/articles/when-to-suspect-renal-artery-fibromuscular-dysplasia-instead-of-primary-hypertension-in-adults-52-58-with-episodic-headache-asymmetric-kidney-size-and-resistant-hypertension",
            "destination": "/articles/fibromuscular-dysplasia-resistant-hypertension-diagnosis",
            "permanent": true
        },
        {
            "source": "/articles/when-to-suspect-holiday-heart-syndrome-before-the-first-palpitation-early-hrv-dips-during-family-video-calls-in-adults-55-60-with-prehypertensive-nighttime-bp-non-dipping",
            "destination": "/articles/hrv-dip-before-holiday-palpitations",
            "permanent": true
        },
        {
            "source": "/articles/when-to-adjust-your-basal-insulin-dose-before-the-first-holiday-party-not-after-using-pre-event-cgm-trend-analysis-in-adults-59-68-with-variable-activity-levels",
            "destination": "/articles/basal-insulin-adjustment-before-holiday-party",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-post-holiday-joint-swelling-only-after-eating-your-daughter-s-homemade-gravy-the-role-of-histamine-rich-fermented-ingredients-mast-cell-priming-and-age-related-dao-decline",
            "destination": "/articles/post-holiday-joint-swelling-gravy-histamine-seniors",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-post-holiday-constipation-only-when-visiting-your-son-s-house-the-role-of-travel-induced-circadian-misalignment-reduced-fiber-variety-and-toilet-posture-shifts-in-adults-71",
            "destination": "/articles/post-holiday-constipation-travel-circadian-seniors",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-post-dinner-dizziness-only-when-eating-holiday-ham-and-why-nitrate-induced-vasodilation-masks-early-orthostatic-hypotension-in-adults-66-with-autonomic-neuropathy",
            "destination": "/articles/holiday-ham-dizziness-autonomic-neuropathy",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-blood-pressure-dips-only-while-reading-fine-print-on-prescription-labels-and-why-that-triggers-transient-cerebral-hypoperfusion-in-adults-79-with-presbyopia-and-carotid-stenosis-50",
            "destination": "/articles/blood-pressure-dip-reading-prescription-labels",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-heart-palpitations-only-when-you-stand-up-to-pour-tea-the-role-of-postural-catecholamine-surges-and-left-atrial-stretch-in-adults-68-with-preserved-ejection-fraction",
            "destination": "/articles/heart-palpitations-when-standing-up-tea",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-earliest-signs-your-mild-orthostatic-tachycardia-is-actually-masking-early-cardiac-sarcoidosis-especially-with-concurrent-uveitis-and-subtle-skin-lesions-in-adults-54-61",
            "destination": "/articles/orthostatic-tachycardia-cardiac-sarcoidosis",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-stable-blood-pressure-readings-are-masking-subclinical-aortic-valve-stenosis-progression-especially-with-concurrent-elevated-nt-probnp-and-normal-echocardiographic-gradient-in-adults-75",
            "destination": "/articles/subclinical-aortic-stenosis-blood-pressure-masking",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-holiday-weight-gain-is-triggering-silent-beta-cell-exhaustion-even-with-normal-a1c-in-adults-55-64-with-family-history-of-early-onset-t2d",
            "destination": "/articles/holiday-weight-gain-beta-cell-exhaustion",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-holiday-travel-itinerary-is-triggering-nocturnal-atrial-fibrillation-especially-with-time-zone-shifts-cabin-hypoxia-and-pre-existing-sleep-disordered-breathing-in-adults-73",
            "destination": "/articles/holiday-travel-nocturnal-afib-warning",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-low-sodium-holiday-soups-sold-in-senior-grocery-aisles-why-83-contain-unlabeled-potassium-binding-excipients-that-impair-cardiac-conduction-in-adults-71-on-spironolactone",
            "destination": "/articles/low-sodium-soup-potassium-excipients",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-interpreting-ambulatory-blood-pressure-monitoring-reports-especially-when-normal-24-hour-averages-hide-nocturnal-non-dipping-morning-surge-and-postprandial-lability-in-adults-66",
            "destination": "/articles/ambulatory-blood-pressure-report-interpretation",
            "permanent": true
        },
        {
            "source": "/articles/how-intermittent-use-of-over-the-counter-eye-drops-with-benzalkonium-chloride-alters-corneal-nerve-regeneration-and-delays-wound-healing-in-adults-76-with-diabetic-keratopathy",
            "destination": "/articles/benzalkonium-chloride-corneal-nerve-regeneration",
            "permanent": true
        },
        {
            "source": "/articles/how-daily-2-minute-upright-post-meal-walking-modulates-postprandial-atrial-stretch-in-adults-57-63-with-mild-left-atrial-enlargement-a-mechanistic-guide",
            "destination": "/articles/post-meal-walking-atrial-stretch",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-exposure-to-low-frequency-traffic-vibration-below-10-hz-modulates-baroreceptor-sensitivity-in-adults-65-70-with-stage-1-hypertension-and-mild-sleep-fragmentation",
            "destination": "/articles/traffic-vibration-baroreceptor-sensitivity-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-warm-spiced-apple-cider-unfiltered-vs-decaf-chai-latte-oat-milk-for-atrial-fibrillation-risk-mitigation-in-adults-64-with-mild-left-atrial-enlargement",
            "destination": "/articles/apple-cider-vs-chai-for-afib",
            "permanent": true
        },
        {
            "source": "/articles/7-hidden-risks-of-overusing-home-blood-pressure-cuffs-with-smart-algorithm-corrections-especially-in-adults-74-with-atrial-fibrillation-and-intermittent-pulse-irregularity",
            "destination": "/articles/home-blood-pressure-cuff-afib-algorithm-errors",
            "permanent": true
        },
        {
            "source": "/articles/5-things-every-woman-over-67-should-know-about-holiday-heart-syndrome-especially-with-concurrent-perimenopausal-estrogen-decline-and-subclinical-coronary-microvascular-dysfunction",
            "destination": "/articles/women-holiday-heart-syndrome-menopause",
            "permanent": true
        },
        {
            "source": "/articles/when-to-suspect-silent-hypoglycemia-during-routine-dental-scaling-and-why-gingival-blood-flow-changes-alter-interstitial-glucose-kinetics-in-adults-69-with-hypoglycemia-associated-autonomic-failure",
            "destination": "/articles/dental-scaling-silent-hypoglycemia-seniors",
            "permanent": true
        },
        {
            "source": "/articles/when-to-suspect-cardiac-amyloidosis-instead-of-hypertensive-heart-disease-in-adults-77-with-unexplained-lvh-and-normal-troponin-and-why-ecg-voltage-criteria-lie-in-obesity-associated-diastolic-stiffness",
            "destination": "/articles/cardiac-amyloidosis-vs-hypertensive-heart-disease",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-mid-afternoon-chest-pressure-only-when-sitting-on-your-granddaughter-s-memory-foam-couch-the-role-of-pelvic-rotation-diaphragmatic-restriction-and-inferior-vena-cava-compression-in-adults-64-with-diastolic-dysfunction",
            "destination": "/articles/chest-pressure-memory-foam-couch",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-earliest-signs-your-denture-adhesive-is-causing-subclinical-cobalamin-deficiency-and-why-that-accelerates-autonomic-neuropathy-progression-in-adults-75-with-type-2-diabetes",
            "destination": "/articles/denture-adhesive-cobalamin-deficiency-autonomic-neuropathy",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-stable-heart-failure-class-ii-diagnosis-is-masking-early-right-ventricular-pa-coupling-failure-especially-with-concurrent-pulmonary-nodules-and-mild-hypoxemia-in-adults-70",
            "destination": "/articles/right-ventricular-pa-coupling-failure-warning-signs",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-evening-zinc-picolinate-supplement-is-disrupting-copper-dependent-superoxide-dismutase-activity-and-accelerating-endothelial-oxidative-stress-in-adults-63-with-early-coronary-microvascular-dysfunction",
            "destination": "/articles/zinc-picolinate-endothelial-oxidative-stress",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-heart-healthy-instant-oatmeal-packets-marketed-to-seniors-why-91-contain-unlabeled-beta-glucan-degradation-byproducts-that-blunt-cholesterol-lowering-efficacy-in-adults-68-with-familial-hypercholesterolemia",
            "destination": "/articles/instant-oatmeal-beta-glucan-degradation",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-heart-healthy-instant-oatmeal-packets-labeled-for-seniors-why-91-contain-hidden-beta-glucan-antagonists-that-impair-endothelial-no-release-in-adults-65-with-subclinical-atherosclerosis",
            "destination": "/articles/instant-oatmeal-endothelial-function-seniors",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-managing-holiday-eating-while-recovering-from-a-recent-percutaneous-coronary-intervention-practical-strategies-for-adults-66-70-with-dual-antiplatelet-therapy",
            "destination": "/articles/holiday-eating-post-pci-dual-antiplatelet-therapy",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-coronary-microvascular-reactivity-without-nitrate-therapy-using-low-dose-pomegranate-ellagitannin-cycling-and-supine-diaphragmatic-breath-holds-in-adults-66-with-inoca",
            "destination": "/articles/coronary-microvascular-reactivity-natural-support",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-arterial-stiffness-reduction-without-nitrate-rich-greens-using-cold-pressed-pomegranate-ginger-syrup-and-diaphragmatic-breathing-cycles-in-adults-67-with-elevated-pulse-wave-velocity",
            "destination": "/articles/arterial-stiffness-reduction-without-nitrates",
            "permanent": true
        },
        {
            "source": "/articles/how-intermittent-cold-water-hand-immersion-30-second-bursts-modulates-coronary-blood-flow-reserve-in-adults-57-64-with-stable-angina-and-normal-coronary-anatomy",
            "destination": "/articles/cold-hand-immersion-coronary-flow-reserve",
            "permanent": true
        },
        {
            "source": "/articles/how-daily-use-of-fabric-softener-sheets-alters-skin-microbiome-diversity-and-why-that-worsens-diabetic-foot-ulcer-healing-in-adults-68-with-peripheral-neuropathy",
            "destination": "/articles/fabric-softener-and-diabetic-foot-ulcer-healing",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-use-of-prescription-hearing-aids-alters-baroreflex-sensitivity-via-auditory-vagal-coupling-and-why-that-masks-early-diastolic-dysfunction-in-adults-72-with-normal-echo-findings",
            "destination": "/articles/hearing-aids-baroreflex-sensitivity-diastolic-dysfunction",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-use-of-calm-inducing-white-noise-machines-alters-endothelial-nitric-oxide-synthase-expression-and-why-that-accelerates-atherosclerosis-in-adults-74-with-mild-cognitive-impairment",
            "destination": "/articles/white-noise-machines-atherosclerosis-seniors",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-exposure-to-quiet-hvac-duct-vibration-alters-aortic-root-motion-dynamics-and-why-that-masks-early-aortic-stiffness-on-standard-pwv-testing-in-adults-76",
            "destination": "/articles/hvac-vibration-aortic-stiffness-testing",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-use-infrared-heating-pads-for-chronic-back-pain-while-taking-ace-inhibitors-evidence-based-thermal-thresholds-for-adults-72-with-stage-2-hypertension-and-mild-ckd",
            "destination": "/articles/infrared-pad-ace-inhibitor-safety",
            "permanent": true
        },
        {
            "source": "/articles/10-foods-that-stabilize-postprandial-systolic-diastolic-gap-without-reducing-overall-blood-pressure-for-adults-76-with-wide-pulse-pressure-and-mild-orthostasis",
            "destination": "/articles/foods-stabilize-pulse-pressure-seniors-orthostasis",
            "permanent": true
        },
        {
            "source": "/articles/when-to-suspect-cardiac-amyloidosis-instead-of-diastolic-heart-failure-in-adults-79-with-preserved-ef-unexplained-weight-loss-and-carpal-tunnel-syndrome-and-why-ecg-alone-is-dangerously-misleading",
            "destination": "/articles/cardiac-amyloidosis-vs-diastolic-failure",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-left-sided-jaw-tightness-only-while-listening-to-classical-music-through-bone-conduction-headphones-the-role-of-temporalis-muscle-activation-vagal-modulation-and-coronary-microvascular-dysfunction-in-adults-59-65-with-atypical-angina",
            "destination": "/articles/atypical-angina-jaw-tightness-classical-music",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-earliest-signs-your-holiday-leftovers-are-causing-subclinical-small-intestinal-bacterial-overgrowth-sibo-in-adults-69-with-chronic-bloating",
            "destination": "/articles/holiday-leftovers-sibo-early-signs-seniors",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-managing-heart-disease-while-recovering-from-cataract-surgery-practical-protocols-for-adults-73-on-beta-blockers-with-preoperative-resting-hr-58-bpm",
            "destination": "/articles/heart-disease-cataract-surgery-seniors",
            "permanent": true
        },
        {
            "source": "/articles/simple-steps-to-prevent-post-holiday-constipation-without-laxatives-using-only-a-digital-scale-your-kitchen-timer-and-3-common-herbs-age-66-sedentary-lifestyle",
            "destination": "/articles/prevent-post-holiday-constipation-naturally",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-endothelial-glycocalyx-repair-without-increasing-nitric-oxide-using-low-dose-hyaluronic-acid-citrus-flavonoid-synergy-and-postprandial-walking-in-adults-67-with-metabolic-syndrome",
            "destination": "/articles/endothelial-glycocalyx-repair-seniors",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-nighttime-use-of-blue-blocking-amber-glasses-alters-melatonin-dependent-bkca-channel-expression-and-why-that-improves-nocturnal-coronary-perfusion-in-adults-71-with-nocturnal-angina",
            "destination": "/articles/amber-glasses-nocturnal-coronary-perfusion",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-use-transdermal-magnesium-chloride-while-on-sacubitril-valsartan-evidence-on-myocardial-fibrosis-markers-nt-probnp-trajectories-and-diuretic-synergy-in-adults-68-with-hfref",
            "destination": "/articles/transdermal-magnesium-sacubitril-valsartan",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-practice-chair-tai-chi-while-recovering-from-atrial-fibrillation-ablation-evidence-based-movement-thresholds-for-atrial-stretch-reduction-and-pulmonary-vein-reconnection-risk-in-adults-61",
            "destination": "/articles/chair-tai-chi-after-afib-ablation-safety",
            "permanent": true
        },
        {
            "source": "/articles/best-seated-tai-chi-sequences-for-adults-82-with-atrial-fibrillation-on-direct-oral-anticoagulants-prioritizing-rhythm-stability-fall-prevention-and-minimal-valsalva-risk",
            "destination": "/articles/seated-tai-chi-atrial-fibrillation-seniors",
            "permanent": true
        },
        {
            "source": "/articles/7-silent-signs-your-hearing-aid-batteries-are-leaching-zinc-into-your-diet-and-how-that-alters-insulin-signaling-in-adults-73-with-long-term-type-2-diabetes",
            "destination": "/articles/zinc-exposure-from-hearing-aids-and-insulin-resistance",
            "permanent": true
        },
        {
            "source": "/articles/7-overlooked-environmental-triggers-that-elevate-nighttime-heart-rate-variability-in-adults-74-with-mild-copd-from-humidifier-mineral-dust-to-bedroom-wall-paint-vocs",
            "destination": "/articles/nighttime-heart-rate-variability-environmental-triggers",
            "permanent": true
        },
        {
            "source": "/articles/5-things-every-man-over-72-should-know-about-testosterone-replacement-therapy-and-its-effect-on-hepatic-glucose-production-especially-with-concomitant-nafld",
            "destination": "/articles/testosterone-therapy-hepatic-glucose-production-seniors",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-times-to-measure-pulse-wave-velocity-after-a-shower-not-just-in-fasting-state-for-adults-70-with-sarcopenic-obesity-and-suspected-arterial-stiffness",
            "destination": "/articles/pulse-wave-velocity-after-shower-seniors",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-times-to-measure-postprandial-glucose-after-dinner-not-just-at-2-hours-for-adults-67-with-gastroparesis-like-symptoms-and-variable-gastric-emptying",
            "destination": "/articles/postprandial-glucose-timing-gastroparesis-seniors",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-times-to-check-your-pulse-during-a-10-minute-walk-not-just-before-or-after-for-adults-63-with-intermittent-claudication-and-silent-ischemia",
            "destination": "/articles/pulse-timing-during-walking-silent-ischemia",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-strategies-to-prevent-post-holiday-weight-regain-in-adults-58-65-with-recent-bariatric-surgery-focused-on-social-eating-triggers-and-adaptive-portion-cues",
            "destination": "/articles/post-bariatric-holiday-weight-regain-prevention",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-post-dinner-fatigue-only-when-eating-at-your-daughter-s-house-the-role-of-ambient-vocs-carpet-off-gassing-and-mitochondrial-stress-in-adults-64-with-fibromyalgia",
            "destination": "/articles/post-dinner-fatigue-holiday-indoor-air",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-glucose-drops-only-while-folding-laundry-the-role-of-repetitive-shoulder-girdle-compression-vagal-tone-shifts-and-hepatic-glycogen-release-in-adults-58-63-with-early-autonomic-dysfunction",
            "destination": "/articles/glucose-drops-folding-laundry-autonomic-dysfunction",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-blood-pressure-to-rise-only-during-video-calls-with-adult-children-the-role-of-subvocal-tension-zoom-posture-and-anticipatory-sympathetic-priming-in-adults-62-71",
            "destination": "/articles/video-call-blood-pressure-spike-family",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-hidden-risks-of-non-stick-ceramic-cookware-coated-with-titanium-dioxide-nanoparticles-and-how-that-alters-glucose-uptake-in-skeletal-muscle-in-adults-59-67-with-insulin-resistance",
            "destination": "/articles/titanium-dioxide-cookware-glucose-uptake",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-earliest-signs-your-evening-magnesium-glycinate-dose-is-causing-subclinical-bp-instability-even-with-normal-serum-levels-in-adults-66-with-mild-diastolic-dysfunction",
            "destination": "/articles/magnesium-glycinate-blood-pressure-instability",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-mild-blood-pressure-elevation-is-actually-masking-secondary-hypertension-especially-with-concurrent-sleep-fragmentation-and-unexplained-weight-gain-in-adults-55-64",
            "destination": "/articles/masking-secondary-hypertension-symptoms",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-home-air-purifier-s-ionizer-is-generating-ozone-that-impairs-pancreatic-islet-oxygenation-even-with-normal-spo2-in-adults-70-with-type-1-diabetes",
            "destination": "/articles/air-purifier-ozone-pancreatic-islet-oxygenation",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-sugar-free-kombucha-labeled-for-seniors-why-82-contain-unlabeled-gluconic-acid-that-mimics-glucose-on-cgm-sensors-in-adults-66-using-real-time-monitoring",
            "destination": "/articles/sugar-free-kombucha-cgms-interference-seniors",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-heart-healthy-canned-soups-labeled-for-seniors-why-68-contain-hidden-sodium-loaders-that-bypass-label-claims-in-adults-69-with-salt-sensitive-hypertension",
            "destination": "/articles/senior-labeled-canned-soup-sodium-trap",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-managing-diabetes-while-recovering-from-hip-fracture-surgery-practical-strategies-for-adults-79-with-preoperative-hba1c-7-8-8-9-and-limited-mobility",
            "destination": "/articles/diabetes-hip-fracture-surgery-recovery-seniors",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-managing-blood-pressure-while-caring-for-a-spouse-with-mid-stage-parkinson-s-age-63-70-no-orthostasis-yet-but-frequent-postprandial-lapses",
            "destination": "/articles/blood-pressure-caregiver-parkinsons-spouse",
            "permanent": true
        },
        {
            "source": "/articles/simple-steps-to-reduce-morning-blood-pressure-variability-during-shaving-or-tooth-brushing-not-just-after-for-adults-67-with-white-coat-amplification-and-carotid-sinus-hypersensitivity",
            "destination": "/articles/morning-hygiene-blood-pressure-variability",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-mitochondrial-biogenesis-in-skeletal-muscle-without-high-intensity-interval-training-using-cold-adapted-green-tea-polyphenols-and-seated-resistance-band-cycles-in-adults-71-with-sarcopenia-and-prediabetes",
            "destination": "/articles/mitochondrial-biogenesis-without-hiit-seniors",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-enhance-glucagon-like-peptide-1-glp-1-secretion-without-probiotics-using-low-temperature-fermented-plum-vinegar-and-supine-tongue-pressure-training-in-adults-61-with-diminished-gut-hormone-reserve",
            "destination": "/articles/glp-1-secretion-without-probiotics-seniors",
            "permanent": true
        },
        {
            "source": "/articles/how-intergenerational-storytelling-grandparent-grandchild-teen-alters-sympathetic-vagal-balance-and-diastolic-pressure-trajectories-in-adults-64-with-prehypertension",
            "destination": "/articles/storytelling-blood-pressure-sympathetic-balance",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-use-of-cooling-topical-gels-with-menthol-alters-trpm8-dependent-insulin-sensitivity-in-subcutaneous-adipose-tissue-and-why-that-masks-early-lipodystrophy-in-adults-66-with-long-standing-insulin-therapy",
            "destination": "/articles/menthol-gels-insulin-sensitivity-lipodystrophy",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-nighttime-ambient-light-exposure-from-smart-nightlights-disrupts-melatonin-mediated-no-synthase-activity-and-elevates-nocturnal-sbp-in-adults-60-with-sleep-onset-insomnia",
            "destination": "/articles/smart-nightlight-nocturnal-sbp-elevation",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-volume-air-conditioning-use-alters-baroreflex-sensitivity-in-adults-73-with-isolated-systolic-hypertension-and-why-just-turning-it-up-makes-it-worse",
            "destination": "/articles/air-conditioning-baroreflex-sensitivity-elderly",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-exposure-to-led-nightlights-in-hallways-disrupts-retinal-melanopsin-signaling-and-elevates-nocturnal-glucose-in-adults-70-with-nocturia-and-poor-sleep-efficiency",
            "destination": "/articles/led-nightlights-nocturnal-glucose-seniors",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-resume-weight-training-after-a-recent-retinal-photocoagulation-procedure-evidence-based-load-thresholds-and-valsalva-avoidance-protocols-for-adults-62-with-proliferative-diabetic-retinopathy",
            "destination": "/articles/weight-training-after-retinal-laser-treatment-seniors",
            "permanent": true
        },
        {
            "source": "/articles/best-seated-resistance-band-exercises-for-adults-75-with-orthostatic-intolerance-and-stage-1-hypertension-balancing-muscle-activation-bp-stability-and-fall-risk",
            "destination": "/articles/seated-resistance-band-hypertension-elderly",
            "permanent": true
        },
        {
            "source": "/articles/best-pillow-modifications-for-adults-64-with-diabetic-cervical-myelopathy-and-orthopnea-balancing-cervical-alignment-airway-patency-and-brachial-plexus-decompression",
            "destination": "/articles/pillow-modifications-diabetic-cervical-myelopathy",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-home-oscillometric-cuffs-vs-ambulatory-monitoring-for-detecting-nocturnal-hypertension-in-adults-71-with-mild-sleep-apnea-and-mild-cognitive-impairment",
            "destination": "/articles/home-cuff-vs-ambulatory-nocturnal-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-times-to-measure-blood-pressure-after-dinner-not-just-before-or-upon-waking-for-adults-65-with-nocturnal-non-dipping-and-mild-cognitive-impairment",
            "destination": "/articles/post-dinner-blood-pressure-timing-elderly",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-glucose-spikes-only-during-family-photos-the-role-of-acute-social-stress-facial-muscle-tension-and-sympathetic-surges-in-adults-57-64-with-long-standing-type-2-diabetes",
            "destination": "/articles/glucose-spikes-family-photos-social-stress",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-managing-diabetes-while-caring-for-a-spouse-with-late-stage-dementia-practical-strategies-for-adults-72-with-limited-caregiver-support",
            "destination": "/articles/diabetes-management-dementia-caregiver-support",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-pancreatic-beta-cell-rest-during-holiday-meals-using-cold-pressed-apple-cinnamon-chutney-and-pre-meal-seated-breathing-in-adults-63",
            "destination": "/articles/beta-cell-rest-holiday-meals-natural-support",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-restore-beta-cell-responsiveness-without-glp-1-agonists-using-fasting-mimicking-cycles-and-polyphenol-rich-fermented-foods-in-adults-63-with-long-standing-type-2-diabetes",
            "destination": "/articles/beta-cell-responsiveness-fasting-mimicking-foods",
            "permanent": true
        },
        {
            "source": "/articles/how-nighttime-light-exposure-from-smart-clocks-disrupts-melatonin-mediated-glp-1-secretion-and-elevates-fasting-glucose-in-adults-59-with-shift-work-history",
            "destination": "/articles/nighttime-light-glp-1-secretion-fasting-glucose",
            "permanent": true
        },
        {
            "source": "/articles/how-intermittent-fasting-affects-hepatic-glycogen-resynthesis-differently-in-women-58-66-vs-men-60-68-with-prediabetes-hormone-sensitive-timing-windows",
            "destination": "/articles/intermittent-fasting-gender-glycogen-resynthesis",
            "permanent": true
        },
        {
            "source": "/articles/how-grandchildren-s-candy-requests-alter-postprandial-glucose-trajectories-in-adults-62-with-early-prediabetes-and-what-to-serve-instead-of-chocolate-covered-almonds",
            "destination": "/articles/postprandial-glucose-family-gatherings-prediabetes",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-dose-nsaid-use-alters-renal-prostaglandin-mediated-glucose-reabsorption-and-accelerates-egfr-decline-in-adults-70-with-stage-3-ckd-and-diabetes",
            "destination": "/articles/nsaid-renal-glucose-reabsorption-ckd",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-use-sauna-therapy-after-a-recent-diabetic-foot-ulcer-closure-evidence-based-temperature-duration-and-hydration-thresholds-for-adults-68-with-peripheral-neuropathy",
            "destination": "/articles/sauna-therapy-diabetic-foot-ulcer-recovery",
            "permanent": true
        },
        {
            "source": "/articles/10-foods-that-stabilize-post-holiday-fasting-glucose-without-lowering-it-for-adults-64-with-history-of-falls-and-hypoglycemia-associated-autonomic-failure",
            "destination": "/articles/stabilize-fasting-glucose-without-lowering",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-earliest-signs-of-cardiac-sarcoidosis-in-adults-59-with-unexplained-av-block-and-normal-ejection-fraction-before-fdg-pet-uptake-becomes-diffuse",
            "destination": "/articles/cardiac-sarcoidosis-early-signs-av-block",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-stabilize-overnight-glucose-without-adjusting-basal-insulin-using-bedtime-protein-timing-foot-warming-and-diaphragmatic-breathing-in-adults-59-66-with-nocturnal-hypoglycemia",
            "destination": "/articles/stabilize-overnight-glucose-without-insulin-adjustment",
            "permanent": true
        },
        {
            "source": "/articles/how-intermittent-exposure-to-urban-traffic-noise-elevates-morning-systolic-pressure-by-8-12-mmhg-even-with-bedroom-windows-closed-in-adults-63-living-near-freeways",
            "destination": "/articles/traffic-noise-morning-systolic-blood-pressure",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-5-minute-cold-water-face-immersion-really-improve-postprandial-insulin-sensitivity-in-adults-66-with-diastolic-dysfunction-and-mild-hypoglycemia-awareness-loss",
            "destination": "/articles/cold-water-face-immersion-insulin-sensitivity",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-use-a-shared-cutting-board-for-holiday-meats-and-raw-veggie-platters-if-you-have-peripheral-neuropathy-a-safety-first-guide-for-adults-72-with-reduced-tactile-sensitivity",
            "destination": "/articles/cutting-board-safety-peripheral-neuropathy-seniors",
            "permanent": true
        },
        {
            "source": "/articles/best-hydration-patterns-for-glucose-homeostasis-during-holiday-parties-not-just-drink-more-water-for-adults-69-with-polypharmacy-and-reduced-thirst-perception",
            "destination": "/articles/holiday-hydration-glucose-homeostasis-polypharmacy",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-slow-steeped-hibiscus-infused-sparkling-water-vs-sugar-free-cranberry-mocktail-impact-on-endothelial-flow-mediated-dilation-in-adults-65-with-mild-hypertension",
            "destination": "/articles/festive-drinks-endothelial-function-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-20-minute-post-dinner-walking-vs-12-minute-pre-dinner-resistance-band-routine-impact-on-fasting-glucose-variability-in-adults-60-with-mild-cognitive-impairment",
            "destination": "/articles/exercise-timing-fasting-glucose-variability",
            "permanent": true
        },
        {
            "source": "/articles/7-silent-signs-your-heart-s-electrical-system-is-deteriorating-detected-via-resting-ecg-variability-not-just-arrhythmia-in-adults-75-with-no-prior-cardiac-diagnosis",
            "destination": "/articles/silent-electrical-heart-deterioration-signs",
            "permanent": true
        },
        {
            "source": "/articles/7-silent-signs-your-hearing-aid-batteries-are-leaching-zinc-into-oral-mucosa-and-why-that-matters-for-adults-74-with-diabetic-retinopathy-and-poor-wound-healing",
            "destination": "/articles/zinc-hearing-aid-batteries-diabetic-retinopathy",
            "permanent": true
        },
        {
            "source": "/articles/5-things-everyone-over-67-should-know-about-sharing-a-single-serving-of-holiday-stuffing-especially-if-taking-warfarin-or-eating-spinach-sage-loaf-daily",
            "destination": "/articles/holiday-stuffing-warfarin-vitamin-k-seniors",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-times-to-serve-a-protein-first-bite-not-just-eat-slowly-to-reduce-post-holiday-triglyceride-spikes-in-adults-68-with-metabolic-syndrome",
            "destination": "/articles/protein-first-timing-triglycerides-metabolic-syndrome",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-normal-blood-pressure-readings-that-occur-only-while-sitting-cross-legged-a-red-flag-for-autonomic-dysregulation-in-adults-61-with-early-diabetes",
            "destination": "/articles/cross-legged-blood-pressure-autonomic-dysregulation",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-of-acute-thiamine-depletion-after-three-days-of-holiday-pie-only-snacking-in-adults-55-65-with-alcohol-use-history-and-preexisting-peripheral-neuropathy",
            "destination": "/articles/holiday-pie-snacking-thiamine-depletion-neuropathy",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-improve-cardiac-mitochondrial-biogenesis-without-supplements-using-postprandial-cold-exposure-and-time-restricted-eating-windows-in-adults-61-with-diastolic-stiffness",
            "destination": "/articles/mitochondrial-biogenesis-natural-diastolic-stiffness",
            "permanent": true
        },
        {
            "source": "/articles/how-late-night-smartphone-use-alters-nocturnal-atrial-fibrillation-burden-not-just-onset-in-adults-71-with-paroxysmal-af-and-mild-obstructive-sleep-apnea",
            "destination": "/articles/smartphone-use-nocturnal-af-burden",
            "permanent": true
        },
        {
            "source": "/articles/how-intergenerational-storytelling-during-dinner-slows-gastric-emptying-and-why-that-helps-postprandial-glucose-in-adults-78-with-mild-cognitive-impairment",
            "destination": "/articles/storytelling-gastric-emptying-postprandial-glucose",
            "permanent": true
        },
        {
            "source": "/articles/how-holiday-candlelight-dinners-alter-circadian-driven-insulin-sensitivity-in-adults-66-with-mild-insulin-resistance-and-what-to-serve-instead-of-rolls",
            "destination": "/articles/candlelight-dinners-insulin-sensitivity-seniors",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-dose-proton-pump-inhibitor-use-alters-gut-microbiome-derived-trimethylamine-n-oxide-tmao-production-and-accelerates-coronary-artery-calcification-in-adults-70-with-gerd-and-stable-cad",
            "destination": "/articles/pom-inhibitor-tmao-coronary-calcification",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-exposure-to-urban-roadway-noise-55-db-increases-nighttime-sympathetic-tone-and-predicts-new-onset-heart-failure-in-adults-64-with-borderline-hypertension",
            "destination": "/articles/roadway-noise-sympathetic-tone-heart-failure",
            "permanent": true
        },
        {
            "source": "/articles/can-you-safely-resume-resistance-training-after-aortic-valve-replacement-evidence-based-thresholds-for-systolic-pressure-response-and-lvot-velocity-in-adults-67-with-mechanical-valves",
            "destination": "/articles/resistance-training-after-aortic-valve-replacement",
            "permanent": true
        },
        {
            "source": "/articles/best-hydration-strategies-for-blood-pressure-stability-during-winter-not-just-drink-more-water-for-adults-76-with-reduced-thirst-perception-and-chronic-constipation",
            "destination": "/articles/winter-hydration-blood-pressure-stability-elderly",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-slow-roasted-sweet-potatoes-with-cinnamon-vs-instant-mashed-sweet-potatoes-with-marshmallows-impact-on-postprandial-glucose-variability-in-adults-67-with-prediabetes",
            "destination": "/articles/sweet-potatoes-glucose-variability-seniors",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-daily-12-minute-tai-chi-flow-vs-supervised-treadmill-walking-impact-on-myocardial-perfusion-reserve-index-in-adults-67-with-microvascular-angina-and-normal-coronary-angiograms",
            "destination": "/articles/tai-chi-vs-treadmill-microvascular-angina",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-times-to-pause-mid-meal-not-just-chew-to-activate-vagal-tone-and-reduce-postprandial-inflammation-in-adults-68-with-rheumatoid-arthritis",
            "destination": "/articles/mid-meal-pausing-vagal-tone-rheumatoid-arthritis",
            "permanent": true
        },
        {
            "source": "/articles/when-to-suspect-cardiac-amyloidosis-before-diastolic-dysfunction-worsens-using-serum-free-light-chains-and-strain-echocardiography-in-adults-79-with-unexplained-orthostatic-hypotension-and-carpal-tunnel-syndrome",
            "destination": "/articles/cardiac-amyloidosis-early-detection-orthostasis",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-normal-blood-pressure-readings-to-mask-left-ventricular-hypertrophy-in-adults-68-with-long-standing-hypertension-and-preserved-ejection-fraction",
            "destination": "/articles/left-ventricular-hypertrophy-masked-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-of-right-heart-strain-that-appear-before-neck-vein-distension-detected-via-subcostal-echocardiographic-view-in-adults-77-with-copd-and-mild-pulmonary-hypertension",
            "destination": "/articles/right-heart-strain-early-echocardiographic-signs",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-low-sugar-store-bought-pumpkin-pie-fillings-why-91-still-contain-high-fructose-corn-syrup-derivatives-that-bypass-first-pass-metabolism-in-adults-70-with-nafld",
            "destination": "/articles/low-sugar-pumpkin-pie-fructose-metabolism-nafld",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-heart-healthy-oat-milk-creamers-why-86-of-brands-contain-emulsifiers-that-impair-endothelial-nitric-oxide-synthase-activity-in-adults-63-with-subclinical-atherosclerosis",
            "destination": "/articles/oat-milk-creamer-endothelial-dysfunction",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-interpreting-your-coronary-artery-calcium-score-with-ct-lung-screening-avoiding-misattribution-of-calcified-nodules-in-adults-63-with-emphysema",
            "destination": "/articles/coronary-calcium-score-ct-lung-screening",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-interpreting-home-blood-pressure-logs-for-adults-74-with-hearing-loss-and-mild-tremor-without-smartphone-apps-or-voice-assistants",
            "destination": "/articles/home-blood-pressure-log-hearing-loss-tremor",
            "permanent": true
        },
        {
            "source": "/articles/simple-steps-to-reduce-aortic-pulse-wave-velocity-using-only-a-blood-pressure-cuff-a-smartphone-mic-and-your-evening-walk-for-adults-65-with-isolated-systolic-hypertension",
            "destination": "/articles/aortic-pulse-wave-velocity-reduction",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-beta-cell-resilience-during-spring-allergy-season-without-antihistamines-or-corticosteroids-in-adults-55-65-with-recent-onset-type-1-diabetes",
            "destination": "/articles/beta-cell-resilience-spring-allergies-type-1",
            "permanent": true
        },
        {
            "source": "/articles/best-breathing-patterns-for-reducing-left-atrial-pressure-during-atrial-fibrillation-episodes-validated-via-invasive-hemodynamic-monitoring-in-adults-70-with-persistent-af",
            "destination": "/articles/breathing-patterns-left-atrial-pressure-af",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-12-minute-tai-chi-qigong-flow-vs-guided-4-7-8-breathing-with-biofeedback-impact-on-central-aortic-systolic-pressure-in-women-69-with-isolated-systolic-hypertension",
            "destination": "/articles/tai-chi-vs-breathing-central-aortic-pressure",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-morning-blood-pressure-spikes-after-starting-a-low-carb-diet-in-adults-65-with-long-standing-hypertension-and-mild-diastolic-dysfunction",
            "destination": "/articles/low-carb-diet-morning-bp-spike-elderly",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-low-sugar-ketchup-and-bbq-sauce-why-93-of-brands-still-trigger-postprandial-glucose-spikes-in-adults-60-with-gastroparesis-like-symptoms",
            "destination": "/articles/low-sugar-ketchup-blood-sugar-spike-gastroparesis",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-baroreflex-sensitivity-without-supplements-using-only-ambient-temperature-shifts-and-postprandial-posture-in-adults-66-with-white-coat-hypertension",
            "destination": "/articles/natural-baroreflex-sensitivity-enhancement",
            "permanent": true
        },
        {
            "source": "/articles/how-intergenerational-food-pushing-during-holiday-dinners-triggers-postprandial-hyperglycemia-in-adults-58-with-latent-autoimmune-diabetes-in-adults-lada",
            "destination": "/articles/intergenerational-food-pushing-holiday-hyperglycemia-lada",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-grade-dehydration-from-nocturnal-polyuria-elevates-plasma-endothelin-1-and-accelerates-microvascular-damage-in-adults-66-with-retinopathy-and-normal-bp",
            "destination": "/articles/nocturnal-polyuria-endothelin-1-microvascular-damage",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-exposure-to-blue-light-from-smart-home-displays-disrupts-melatonin-mediated-nocturnal-bp-dipping-in-adults-70-with-mild-cognitive-impairment",
            "destination": "/articles/blue-light-nocturnal-blood-pressure-dipping",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-3-minute-cold-water-face-immersion-really-improve-vagal-tone-and-postprandial-glucose-stability-in-adults-75-with-type-2-diabetes-and-orthostatic-hypotension",
            "destination": "/articles/cold-water-face-immersion-vagal-tone-glucose",
            "permanent": true
        },
        {
            "source": "/articles/can-you-eat-leftover-mashed-potatoes-cold-the-next-morning-without-spiking-glucose-a-glycemic-index-comparison-for-adults-64-with-gastroparesis-like-symptoms",
            "destination": "/articles/cold-mashed-potatoes-glycemic-index-gastroparesis",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-slow-cooked-collard-greens-with-smoked-turkey-leg-vs-instant-pot-collards-with-liquid-smoke-impact-on-urinary-8-ohdg-levels-in-adults-76-with-chronic-kidney-disease-stage-3",
            "destination": "/articles/collard-greens-cooking-method-oxidative-stress-ckd",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-unexplained-weight-gain-in-adults-55-69-with-type-2-diabetes-on-glp-1-agonists-and-how-to-differentiate-fluid-retention-from-adipose-expansion",
            "destination": "/articles/weight-gain-glp-1-agonists-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-onset-of-bloating-and-abdominal-distension-after-eating-mashed-potatoes-at-family-gatherings-even-in-adults-63-with-no-known-celiac-disease",
            "destination": "/articles/bloating-mashed-potatoes-seniors",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-glycemic-resilience-during-holiday-social-events-without-supplements-or-diet-pills-for-adults-55-64-newly-diagnosed-with-type-2-diabetes",
            "destination": "/articles/glycemic-resilience-holiday-social-events",
            "permanent": true
        },
        {
            "source": "/articles/how-intermittent-use-of-over-the-counter-nsaids-for-back-pain-disrupts-renal-prostaglandin-balance-and-why-that-raises-risk-of-acute-kidney-injury-in-adults-62-with-stage-2-diabetic-nephropathy",
            "destination": "/articles/nsaids-and-kidney-injury-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/how-intermittent-silence-not-just-quiet-lowers-central-aortic-systolic-pressure-in-adults-64-with-white-coat-hypertension-and-high-cortisol-awakening-response",
            "destination": "/articles/intermittent-silence-central-aortic-pressure",
            "permanent": true
        },
        {
            "source": "/articles/how-intergenerational-cooking-stress-elevates-cortisol-driven-dawn-phenomenon-in-men-62-with-long-term-type-2-diabetes-and-untreated-sleep-disordered-breathing",
            "destination": "/articles/intergenerational-cooking-cortisol-dawn-phenomenon",
            "permanent": true
        },
        {
            "source": "/articles/how-holiday-tablecloth-patterns-and-low-light-centerpieces-impair-food-recognition-in-adults-78-with-early-macular-degeneration-and-what-to-serve-instead",
            "destination": "/articles/food-recognition-macular-degeneration",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-10-minute-barefoot-walking-on-morning-grass-really-improve-glycemic-variability-in-adults-68-with-sedentary-lifestyle-and-peripheral-neuropathy",
            "destination": "/articles/barefoot-walking-glycemic-variability-seniors",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-homemade-bone-broth-soup-simmered-24-hours-vs-low-sodium-canned-vegetable-soup-impact-on-endothelial-function-in-adults-71-with-mild-hypertension",
            "destination": "/articles/bone-broth-vs-canned-soup-endothelial-function",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-10-minute-post-dinner-walking-after-holiday-dinner-vs-5-minute-deep-breathing-impact-on-2-hour-postprandial-glucose-in-adults-66-with-obesity-and-sleep-apnea",
            "destination": "/articles/post-dinner-walking-vs-breathing-glucose",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-times-to-check-your-glucose-during-the-holidays-based-on-circadian-ampk-activation-peaks-in-adults-70-with-sarcopenia-and-insulin-resistance",
            "destination": "/articles/best-times-check-glucose-holidays-seniors",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-sudden-thirst-and-frequent-urination-during-holiday-travel-especially-if-you-re-69-with-undiagnosed-prediabetes-and-mild-heart-failure",
            "destination": "/articles/sudden-thirst-holiday-travel-prediabetes",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-guilt-free-holiday-smoothie-bowls-served-at-family-brunches-why-frozen-fruit-blends-can-spike-triglycerides-in-men-68-with-metabolic-syndrome",
            "destination": "/articles/holiday-smoothie-bowls-triglycerides",
            "permanent": true
        },
        {
            "source": "/articles/simple-steps-to-adjust-your-holiday-dessert-portion-before-the-first-bite-using-visual-cues-that-work-for-adults-83-with-age-related-visual-processing-decline",
            "destination": "/articles/dessert-portion-control-visual-decline",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-mitochondrial-biogenesis-in-pancreatic-beta-cells-without-supplements-for-adults-59-with-long-term-type-2-diabetes-and-mild-fasting-hyperglycemia",
            "destination": "/articles/mitochondrial-biogenesis-beta-cells-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-i-can-just-skip-breakfast-to-offset-holiday-dinner-calories-why-this-backfires-on-circadian-lipid-metabolism-in-adults-64-with-mixed-dyslipidemia",
            "destination": "/articles/skip-breakfast-holiday-calories-myth",
            "permanent": true
        },
        {
            "source": "/articles/how-grandparenting-induced-sleep-fragmentation-alters-nocturnal-cortisol-rhythms-and-why-that-elevates-fasting-glucose-in-adults-66-with-type-2-diabetes",
            "destination": "/articles/grandparenting-sleep-cortisol-fasting-glucose",
            "permanent": true
        },
        {
            "source": "/articles/how-grandchildren-s-candy-driven-mealtime-distraction-elevates-evening-cortisol-and-impairs-overnight-fat-oxidation-in-adults-66-with-abdominal-obesity",
            "destination": "/articles/candy-distraction-cortisol-fat-oxidation",
            "permanent": true
        },
        {
            "source": "/articles/does-adding-apple-cider-vinegar-to-holiday-salad-dressing-actually-reduce-postprandial-glucose-in-adults-59-with-insulin-resistance-what-the-2024-rct-data-shows",
            "destination": "/articles/apple-cider-vinegar-postprandial-glucose",
            "permanent": true
        },
        {
            "source": "/articles/best-low-heat-cooking-methods-for-preserving-polyphenol-bioavailability-in-berries-and-onions-for-adults-64-with-type-2-diabetes-and-mild-cerebral-hypoperfusion",
            "destination": "/articles/low-heat-cooking-polyphenols-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/5-things-you-should-know-before-accepting-a-holiday-cookie-swap-especially-if-you-re-81-with-severe-peripheral-neuropathy-and-nocturnal-hypoglycemia-history",
            "destination": "/articles/cookie-swap-diabetes-neuropathy-seniors",
            "permanent": true
        },
        {
            "source": "/articles/when-to-suspect-cardiac-amyloidosis-in-men-76-with-unexplained-low-voltage-ecg-bilateral-carpal-tunnel-and-progressive-fatigue-even-with-normal-echocardiogram",
            "destination": "/articles/cardiac-amyloidosis-diagnosis-low-voltage-ecg-older-men",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-of-subclinical-right-ventricular-dysfunction-in-women-58-67-with-obesity-gerd-and-nocturnal-cough-that-mimic-asthma-or-chronic-bronchitis",
            "destination": "/articles/right-ventricular-dysfunction-nocturnal-cough-women",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-heart-healthy-air-fryer-cooking-for-adults-70-with-established-coronary-artery-calcification-and-why-oxidized-cholesterol-matters-more-than-saturated-fat",
            "destination": "/articles/air-fryer-oxidized-cholesterol-coronary-calcification",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-restore-circadian-rhythm-of-anp-secretion-in-adults-71-with-nocturnal-polyuria-and-stage-2-hypertension-without-melatonin-or-beta-blockers",
            "destination": "/articles/restore-anp-secretion-circadian-rhythm-older-adults",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-4-minute-morning-cold-face-immersion-diving-reflex-vs-5-minute-evening-vagus-nerve-stimulation-via-humming-impact-on-24-hour-hrv-in-adults-60-79-with-chronic-stress-and-elevated-crp",
            "destination": "/articles/cold-face-immersion-vs-vagus-humming-hrvar",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-sudden-fatigue-after-holiday-meals-distinguishing-normal-fullness-from-early-cardiac-diastolic-dysfunction-in-women-65-with-obesity-and-sleep-apnea",
            "destination": "/articles/sudden-fatigue-after-holiday-meals-cardiac-diastolic-dysfunction",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-gastric-acid-secretion-during-family-meals-without-supplements-or-ppis-for-adults-66-78-with-age-related-hypochlorhydria-and-frequent-bloating",
            "destination": "/articles/support-gastric-acid-secretion-family-meals",
            "permanent": true
        },
        {
            "source": "/articles/how-intergenerational-dining-stress-activates-the-amygdala-hypothalamic-axis-and-what-to-eat-before-the-gathering-to-stabilize-cortisol-and-glucose-in-adults-60",
            "destination": "/articles/intergenerational-dining-stress-cortisol-glucose",
            "permanent": true
        },
        {
            "source": "/articles/how-gut-fungal-overgrowth-candida-albicans-correlates-with-post-antibiotic-glucose-spikes-in-adults-59-73-with-recurrent-utis-and-long-term-metformin-use",
            "destination": "/articles/gut-fungi-post-antibiotic-glucose-spikes",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-slow-cooked-sweet-potatoes-with-brown-sugar-butter-vs-roasted-with-cinnamon-pecans-impact-on-postprandial-endothelial-function-in-adults-58-69-with-metabolic-syndrome",
            "destination": "/articles/sweet-potatoes-roasted-vs-slow-cooked-endothelial-function",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-ways-to-buffer-alcohol-s-glycemic-vasodilatory-effects-at-family-gatherings-for-adults-57-71-with-prediabetes-and-orthostatic-hypotension",
            "destination": "/articles/buffer-alcohol-glycemic-vasodilatory-effects",
            "permanent": true
        },
        {
            "source": "/articles/when-to-suspect-pheochromocytoma-in-adults-57-70-with-episodic-palpitations-normal-echo-and-normal-24-hour-urinary-metanephrines-but-elevated-plasma-free-metanephrines",
            "destination": "/articles/pheochromocytoma-suspicion-adults-57-70-normal-urinary-metanephrines",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-postprandial-cholinergic-tone-without-supplements-for-adults-66-79-with-mild-cognitive-impairment-and-family-dinner-overstimulation",
            "destination": "/articles/cholinergic-tone-family-dinner-natural",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-endothelial-nitric-oxide-synthase-recoupling-within-72-hours-for-adults-64-77-with-hypertension-high-adma-and-frequent-nsaid-use",
            "destination": "/articles/endothelial-nitric-oxide-synthase-recoupling",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-10-minute-resistance-band-training-lower-fasting-glucose-and-increase-skeletal-muscle-glut4-translocation-in-adults-67-79-with-sarcopenic-obesity",
            "destination": "/articles/resistance-band-training-fasting-glucose-elderly",
            "permanent": true
        },
        {
            "source": "/articles/best-walking-protocols-for-adults-71-with-type-2-diabetes-and-mild-peripheral-artery-disease-to-improve-capillary-recruitment-without-triggering-claudication",
            "destination": "/articles/walking-protocol-peripheral-artery-disease-elderly",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-grandma-s-slow-cooked-collards-with-ham-hock-vs-modern-low-sodium-saut-ed-version-impact-on-endothelial-function-in-adults-61-75-with-stage-2-hypertension",
            "destination": "/articles/collard-greens-endothelial-function-comparison",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-10-minute-morning-sunlight-exposure-vs-6-minute-evening-blue-blocking-glasses-impact-on-circadian-bp-dip-in-adults-61-78-with-non-dipping-pattern",
            "destination": "/articles/sunlight-vs-blue-blocking-glasses-blood-pressure-dip",
            "permanent": true
        },
        {
            "source": "/articles/why-sudden-weight-loss-5-in-3-months-in-adults-80-with-stable-heart-failure-predicts-1-year-mortality-better-than-nyha-class-or-bnp-and-what-to-do-next",
            "destination": "/articles/weight-loss-heart-failure-elderly-prognosis",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-white-coat-readings-that-persist-in-the-er-differentiating-acute-hypertensive-urgency-from-masked-stress-induced-surges-in-adults-68",
            "destination": "/articles/white-coat-hypertension-emergency-room-adults-68",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-earliest-lab-clues-of-mitochondrial-dysfunction-in-skeletal-muscle-in-adults-54-65-with-type-2-diabetes-and-persistent-exercise-intolerance",
            "destination": "/articles/mitochondrial-dysfunction-lab-clues-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-interpreting-your-oral-glucose-tolerance-test-ogtt-if-you-re-55-and-have-unexplained-fatigue-night-sweats-and-reactive-hypoglycemia",
            "destination": "/articles/ogtt-interpretation-reactive-hypoglycemia-adults",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-improve-endothelial-dependent-vasodilation-within-90-minutes-for-adults-57-74-with-obesity-elevated-adma-and-impaired-flow-mediated-dilation",
            "destination": "/articles/improve-endothelial-function-quickly",
            "permanent": true
        },
        {
            "source": "/articles/5-things-every-woman-over-60-with-type-2-diabetes-and-polycystic-ovarian-syndrome-history-should-know-about-androgen-decline-and-metabolic-acceleration",
            "destination": "/articles/pcos-diabetes-menopause-androgen-decline",
            "permanent": true
        },
        {
            "source": "/articles/why-heart-failure-with-preserved-ejection-fraction-hfpef-often-masquerades-as-just-aging-in-women-70-and-how-a-3-minute-sitting-to-standing-test-can-reveal-it",
            "destination": "/articles/hfpref-misdiagnosed-as-aging-women",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-mitochondrial-biogenesis-in-skeletal-muscle-without-supplements-for-adults-56-70-with-insulin-resistance-and-sedentary-desk-jobs",
            "destination": "/articles/mitochondrial-biogenesis-insulin-resistance",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-mitochondrial-biogenesis-in-cardiomyocytes-without-supplements-for-adults-63-80-with-long-standing-hypertension-and-low-vo-peak",
            "destination": "/articles/mitochondrial-biogenesis-heart-natural",
            "permanent": true
        },
        {
            "source": "/articles/how-social-isolation-accelerates-vascular-aging-in-adults-70-living-alone-and-why-a-15-minute-daily-voice-call-lowers-pulse-wave-velocity-within-3-weeks",
            "destination": "/articles/social-isolation-vascular-aging",
            "permanent": true
        },
        {
            "source": "/articles/how-long-term-proton-pump-inhibitor-use-elevates-risk-of-subclinical-atherosclerosis-in-adults-59-71-with-gerd-and-low-hdl-c-independent-of-magnesium-levels",
            "destination": "/articles/pom-inhibitors-atherosclerosis-gut-microbiome",
            "permanent": true
        },
        {
            "source": "/articles/how-long-term-metformin-use-alters-gut-microbiome-diversity-and-butyrate-production-in-adults-67-81-with-type-2-diabetes-and-constipation-predominant-ibs",
            "destination": "/articles/metformin-gut-microbiome-butyrate-constipation",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-8-minute-diaphragmatic-breathing-lower-fasting-glucose-and-homa-ir-in-adults-59-69-with-stress-induced-hyperglycemia-and-high-salivary-alpha-amylase",
            "destination": "/articles/diaphragmatic-breathing-fasting-glucose",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-morning-walking-pre-coffee-fasted-15-min-vs-evening-resistance-band-routine-post-dinner-12-min-impact-on-24-hour-ambulatory-bp-variability-in-adults-66-79-with-nocturnal-hypertension",
            "destination": "/articles/morning-vs-evening-exercise-nocturnal-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/5-things-every-woman-over-65-with-early-stage-breast-cancer-should-know-before-starting-aromatase-inhibitor-therapy-especially-if-she-has-pre-existing-microvascular-coronary-dysfunction",
            "destination": "/articles/aromatase-inhibitors-heart-microvascular-dysfunction",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-interpreting-home-pulse-oximetry-trends-in-adults-70-with-chronic-heart-failure-and-copd-when-desaturation-patterns-signal-worsening-rv-function",
            "destination": "/articles/pulse-oximetry-heart-failure-copd-interpretation",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-my-heart-is-fine-because-my-ekg-is-normal-what-cardiac-mri-strain-mapping-reveals-in-adults-56-68-with-recurrent-palpitations-and-no-structural-disease",
            "destination": "/articles/ekg-normal-cardiac-mri-strain",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-just-one-slice-of-holiday-pie-won-t-raise-my-triglycerides-what-fasting-chylomicron-clearance-testing-reveals-in-adults-61-75-with-hypertriglyceridemia",
            "destination": "/articles/one-slice-pie-triglycerides-seniors-myth",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-warm-spiced-apple-cider-unsweetened-stovetop-simmered-vs-store-bought-diet-eggnog-low-fat-sucralose-sweetened-impact-on-postprandial-endothelial-function-in-adults-66-80-with-early-atherosclerosis",
            "destination": "/articles/apple-cider-vs-eggnog-endothelial-function-seniors",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-slow-cooked-herb-roasted-chicken-breast-skinless-no-broth-vs-holiday-style-chicken-pot-pie-frozen-pre-portioned-impact-on-4-hour-postprandial-triglyceride-clearance-in-adults-60-72-with-hypertriglyceridemia",
            "destination": "/articles/chicken-preparation-triglyceride-clearance-hypertriglyceridemia",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-cold-pressed-flaxseed-oil-refrigerated-30-days-old-vs-ground-flaxseed-pre-soaked-12-hours-impact-on-postprandial-triglyceride-spikes-in-adults-62-78-with-diabetic-dyslipidemia",
            "destination": "/articles/flaxseed-oil-vs-ground-flaxseed-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-normalize-heart-rate-variability-within-90-minutes-of-alcohol-consumption-for-adults-56-67-with-low-baseline-hrv-and-social-drinking-habit",
            "destination": "/articles/normalize-heart-rate-variability-after-alcohol",
            "permanent": true
        },
        {
            "source": "/articles/how-holiday-travel-disrupts-circadian-rhythm-and-triggers-atrial-fibrillation-in-adults-68-with-diagnosed-af-and-time-zone-shifted-medication-schedules",
            "destination": "/articles/holiday-travel-circadian-rhythm-af-trigger",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-maple-glazed-sweet-potatoes-roasted-skin-on-vs-candied-yams-canned-marshmallow-topped-impact-on-2-hour-postprandial-glucose-in-adults-61-79-with-long-standing-t2d",
            "destination": "/articles/maple-glazed-sweet-potatoes-vs-candied-yams-blood-sugar",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-cranberry-relish-fresh-no-added-sugar-vs-canned-jellied-cranberry-sauce-impact-on-postprandial-glucose-variability-in-adults-68-with-gastroparesis-and-type-2-diabetes",
            "destination": "/articles/cranberry-relish-vs-canned-sauce-gastroparesis",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-onset-of-wine-headache-with-palpitations-in-adults-60-71-with-migraine-associated-cortical-spreading-depression-and-undiagnosed-pacs",
            "destination": "/articles/wine-headache-palpitations-migraine-cortical",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-sudden-cravings-for-candy-after-midnight-during-new-year-s-eve-in-adults-55-with-night-eating-syndrome-and-untreated-obstructive-sleep-apnea",
            "destination": "/articles/midnight-candy-cravings-new-years-eve-sleep-apnea",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-sugar-free-holiday-cookies-labeled-for-diabetics-what-the-ingredients-panel-reveals-about-polyol-malabsorption-and-postprandial-fatigue",
            "destination": "/articles/sugar-free-cookies-polyol-malabsorption-fatigue",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-cardiac-mitochondrial-biogenesis-using-time-restricted-eating-with-late-afternoon-polyphenol-timing-for-adults-59-74-with-diastolic-heart-failure-and-low-peak-vo2",
            "destination": "/articles/mitochondrial-biogenesis-heart-failure-trf",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-mulled-wine-simmered-45-min-no-added-sugar-vs-sparkling-cider-unfiltered-no-sulfites-impact-on-post-prandial-cardiac-rhythm-stability-in-adults-64-76-with-ibs-and-af",
            "destination": "/articles/mulled-wine-vs-sparkling-cider-arrhythmia",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-salt-sensitivity-in-black-adults-55-72-what-genomic-studies-reveal-about-enac-variants-potassium-excretion-and-real-world-dietary-response",
            "destination": "/articles/salt-sensitivity-myths-in-black-adults",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-slow-cooked-collard-greens-vinegar-brined-no-bacon-vs-creamed-spinach-low-fat-milk-no-cream-cheese-impact-on-post-meal-potassium-and-egfr-stability-in-adults-73-with-stage-3-ckd",
            "destination": "/articles/collard-greens-vs-creamed-spinach-kidney-disease",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-home-based-isometric-handgrip-training-vs-supervised-interval-cycling-impact-on-central-aortic-pressure-in-men-64-76-with-isolated-systolic-hypertension",
            "destination": "/articles/isometric-handgrip-vs-cycling-systolic-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-interpreting-bp-variability-metrics-sd-cv-arv-from-your-ambulatory-monitor-especially-if-you-re-66-with-white-coat-effect-and-cognitive-concerns",
            "destination": "/articles/ambulatory-blood-pressure-variability-interpretation",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-mitochondrial-biogenesis-in-cardiac-myocytes-using-time-restricted-feeding-post-dinner-walking-in-adults-62-75-with-diastolic-dysfunction",
            "destination": "/articles/mitochondrial-biogenesis-diastolic-dysfunction",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-mitochondrial-biogenesis-after-holiday-overeating-without-supplements-for-adults-59-70-with-sedentary-lifestyle-and-low-vo2-max",
            "destination": "/articles/mitochondrial-biogenesis-after-overeating-seniors",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-10-minute-guided-vagal-breathing-lower-central-systolic-pressure-in-adults-60-73-with-elevated-aortic-augmentation-index-and-high-job-stress",
            "destination": "/articles/vagal-breathing-central-systolic-pressure",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-evening-tart-cherry-juice-8-oz-vs-standard-melatonin-1-mg-impact-on-nocturnal-systolic-bp-and-sleep-architecture-in-adults-64-80-with-insomnia-and-non-dipping",
            "destination": "/articles/tart-cherry-juice-vs-melatonin-for-blood-pressure",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-continuous-glucose-monitoring-cgm-with-automated-insulin-delivery-vs-flash-glucose-monitoring-with-manual-dosing-for-adults-71-with-mild-cognitive-impairment-and-nocturnal-hypoglycemia",
            "destination": "/articles/cgm-vs-flash-glucose-monitoring-older-adults",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-pancreatic-beta-cell-resilience-using-polyphenol-rich-fermented-foods-for-adults-56-72-with-recent-onset-type-2-diabetes-and-high-hs-crp",
            "destination": "/articles/fermented-foods-beta-cell-resilience-type-2-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-improve-hepatic-insulin-sensitivity-using-time-restricted-eating-with-early-evening-protein-for-adults-61-75-with-nafld-and-elevated-alt",
            "destination": "/articles/time-restricted-eating-hepatic-insulin-sensitivity",
            "permanent": true
        },
        {
            "source": "/articles/how-low-dose-naltrexone-ldn-affects-endothelial-inflammation-and-bp-variability-in-adults-56-70-with-long-standing-rheumatoid-arthritis-and-stage-1-hypertension",
            "destination": "/articles/low-dose-naltrexone-and-blood-pressure-arthritis",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-traditional-roast-turkey-skin-on-herb-rubbed-vs-slow-braised-turkey-leg-bone-in-low-sodium-broth-impact-on-postprandial-uric-acid-in-men-62-79-with-gout-and-mild-ckd",
            "destination": "/articles/turkey-preparation-gout-uric-acid-comparison",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-right-ventricular-adaptation-to-pulmonary-vascular-resistance-in-adults-63-79-with-mild-copd-and-preserved-left-ventricular-ejection-fraction",
            "destination": "/articles/right-ventricular-adaptation-copd-seniors",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-renin-angiotensin-system-balance-using-zinc-optimized-plant-proteins-for-adults-61-73-with-early-stage-ckd-and-stage-1-hypertension",
            "destination": "/articles/renin-angiotensin-balance-natural-support",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-warm-herbal-decoction-chamomile-hawthorn-vs-standard-evening-magnesium-glycinate-impact-on-nocturnal-afib-burden-in-men-61-75-with-holiday-heart-syndrome",
            "destination": "/articles/hawthorn-vs-magnesium-holiday-heart",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-stable-heart-failure-is-masking-early-right-ventricular-fibrosis-especially-with-elevated-serum-galectin-3-and-reduced-rv-strain-rate",
            "destination": "/articles/right-ventricular-fibrosis-galectin-3-warning-signs",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-one-bite-dessert-sharing-how-micro-dosing-added-sugars-disrupts-circadian-glucose-rhythms-in-adults-63-80-with-shifted-melatonin-onset-and-evening-hyperglycemia",
            "destination": "/articles/one-bite-dessert-circadian-glucose-rhythm",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-normalize-post-feast-atrial-electrophysiology-using-cold-compress-timing-and-cervical-positioning-for-adults-70-with-prior-holiday-induced-afib",
            "destination": "/articles/quick-atrial-electrophysiology-normalization",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-dose-cadmium-exposure-from-rice-based-diets-alters-cardiac-ryanodine-receptor-function-in-adults-59-76-with-atrial-fibrillation-and-normal-ef",
            "destination": "/articles/cadmium-exposure-atrial-fibrillation-ryanodine-receptor",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-heart-healthy-olive-oil-labels-why-polyphenol-content-varies-300-between-bottles-and-what-that-means-for-endothelial-repair-in-adults-60",
            "destination": "/articles/olive-oil-polyphenols-endothelial-repair-seniors",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-normalize-morning-bp-surge-using-pre-rise-hydration-timing-foot-warming-and-cervical-pillow-angle-for-adults-67-with-sleep-apnea-and-elevated-morning-sbp",
            "destination": "/articles/morning-blood-pressure-surge-reduction",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-normalize-left-atrial-appendage-flow-velocity-using-diaphragmatic-breathing-and-postural-sequencing-especially-in-adults-65-with-cha-ds-vasc-3",
            "destination": "/articles/left-atrial-appendage-flow-velocity-breathing",
            "permanent": true
        },
        {
            "source": "/articles/how-long-distance-air-travel-alters-endothelial-glycocalyx-thickness-and-microvascular-permeability-in-adults-61-77-with-stage-2-hypertension-and-prior-dvt",
            "destination": "/articles/air-travel-endothelial-glycocalyx-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/can-daily-4-minute-nasal-breathing-sequencing-buteyko-box-breathing-reduce-central-aortic-systolic-pressure-in-women-58-71-with-elevated-pulse-wave-velocity",
            "destination": "/articles/nasal-breathing-central-aortic-pressure",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-slow-chewed-roast-turkey-vs-ground-turkey-patties-impact-on-satiety-hormone-release-and-post-meal-fullness-in-adults-55-69-with-mild-gastroparesis-and-early-sarcopenia",
            "destination": "/articles/chewing-turkey-satiety-gastroparesis",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-4-minute-daily-isometric-handgrip-vs-15-minute-morning-tai-chi-for-reducing-central-aortic-systolic-pressure-in-adults-60-74-with-isolated-systolic-hypertension",
            "destination": "/articles/isometric-handgrip-tai-chi-central-aortic-pressure",
            "permanent": true
        },
        {
            "source": "/articles/5-things-everyone-over-75-should-know-about-silent-myocardial-infarction-detection-using-continuous-ecg-patch-monitoring-and-ai-derived-st-t-morphology-clustering",
            "destination": "/articles/silent-myocardial-infarction-ecg-patch-monitoring",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-ways-to-protect-mitochondrial-cardiomyocyte-function-using-meal-timing-nutrient-synergy-and-circadian-light-exposure-for-adults-55-69-with-subclinical-lv-hypertrophy",
            "destination": "/articles/mitochondrial-heart-health-meal-timing-seniors",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-intermittent-fasting-16-8-and-beta-cell-regeneration-in-adults-55-67-with-recent-onset-type-2-diabetes-and-preserved-c-peptide",
            "destination": "/articles/intermittent-fasting-beta-cell-regeneration",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-mitochondrial-biogenesis-in-cardiomyocytes-using-pomegranate-derived-urolithin-a-and-time-restricted-feeding-for-adults-63-79-with-diabetic-cardiomyopathy",
            "destination": "/articles/urolithin-a-mitochondrial-biogenesis-diabetic-cardiomyopathy",
            "permanent": true
        },
        {
            "source": "/articles/how-indoor-air-pollutants-pm2-5-no2-disrupt-pancreatic-islet-mitochondrial-respiration-and-exacerbate-glucose-variability-in-adults-60-74-with-type-2-diabetes-and-urban-residency",
            "destination": "/articles/air-pollution-pancreatic-mitochondria-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-dose-corticosteroid-use-e-g-inhaled-budesonide-alters-hepatic-gluconeogenic-enzyme-expression-in-adults-65-81-with-type-2-diabetes-and-asthma",
            "destination": "/articles/inhaled-steroids-gluconeogenesis-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/best-breathing-patterns-to-reduce-right-atrial-pressure-during-stair-climbing-in-adults-68-with-tricuspid-regurgitation-and-elevated-jugular-venous-pressure",
            "destination": "/articles/breathing-patterns-right-atrial-pressure-seniors",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-daily-10-minute-tai-chi-flow-vs-guided-heart-coherence-biofeedback-for-improving-24-hour-hrv-in-women-64-78-with-hypertension-and-perimenopausal-vasomotor-symptoms",
            "destination": "/articles/tai-chi-vs-heart-coherence-biofeedback-women",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-normal-office-bp-and-elevated-ambulatory-mean-arterial-pressure-in-adults-72-with-white-coat-resolved-but-persistent-microalbuminuria",
            "destination": "/articles/mean-arterial-pressure-microalbuminuria-elderly",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-just-a-little-wine-alcohol-s-real-time-effect-on-fasting-glucose-rebound-and-sleep-architecture-in-adults-59-73-with-prediabetes-and-fragmented-sleep",
            "destination": "/articles/wine-fasting-glucose-rebound-sleep-fragmentation",
            "permanent": true
        },
        {
            "source": "/articles/what-to-eat-after-the-main-course-a-90-second-post-dinner-strategy-to-prevent-late-night-glucose-spikes-in-men-65-with-type-2-diabetes-and-nocturnal-hypoglycemia-history",
            "destination": "/articles/post-dinner-snack-glucose-spike-prevention",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-healthy-swap-salad-dressing-is-actually-driving-sodium-induced-endothelial-stiffness-in-adults-70-with-stage-1-hypertension-and-reduced-arterial-compliance",
            "destination": "/articles/salad-dressing-sodium-endothelial-stiffness",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-continuous-glucose-monitor-is-misreading-due-to-subcutaneous-edema-in-adults-70-with-chronic-heart-failure-and-diuretic-dependent-volume-control",
            "destination": "/articles/cgm-edema-heart-failure-diuretics",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-normalize-postprandial-triglyceride-clearance-using-meal-order-and-chewing-duration-especially-in-adults-56-69-with-diabetic-dyslipidemia-and-pancreatic-steatosis",
            "destination": "/articles/meal-order-triglyceride-clearance-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-gastric-acid-resilience-during-multi-course-holiday-meals-for-adults-67-on-long-term-ppi-therapy-and-low-pepsinogen-i-ii-ratios",
            "destination": "/articles/gastric-acid-resilience-ppi-therapy-holiday-meals",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-capillary-rarefaction-reversal-using-low-dose-pomegranate-ellagitannins-and-diaphragmatic-breathing-for-adults-64-79-with-hypertension-and-reduced-nailfold-capillary-density",
            "destination": "/articles/capillary-rarefaction-reversal-natural",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-dose-lead-exposure-from-vintage-home-renovation-dust-alters-heme-synthesis-and-nitric-oxide-bioavailability-in-adults-57-74-with-resistant-hypertension",
            "destination": "/articles/lead-exposure-resistant-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-5-minute-nasal-breathing-practice-improve-baroreflex-sensitivity-and-reduce-postprandial-blood-pressure-lability-in-adults-63-77-with-type-2-diabetes-and-orthostatic-hypotension",
            "destination": "/articles/nasal-breathing-baroreflex-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-morning-7-a-m-walking-on-an-empty-stomach-vs-30-minute-post-dinner-walk-for-reducing-nocturnal-glucose-spikes-in-men-59-68-with-prediabetes-and-visceral-adiposity",
            "destination": "/articles/morning-vs-evening-walk-prediabetes",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-evening-60-minute-seated-cycling-vs-morning-20-minute-resistance-band-routine-for-improving-24-hour-bp-variability-in-adults-60-73-with-isolated-systolic-hypertension",
            "destination": "/articles/exercise-timing-blood-pressure-variability",
            "permanent": true
        },
        {
            "source": "/articles/7-hidden-portion-distortions-that-sabotage-blood-sugar-control-at-family-dinners-especially-for-adults-58-74-with-prediabetes-and-slow-gastric-emptying",
            "destination": "/articles/portion-distortion-family-dinner-prediabetes",
            "permanent": true
        },
        {
            "source": "/articles/12-signs-your-home-blood-pressure-monitor-is-giving-false-low-readings-especially-if-you-have-arm-lymphedema-calcified-brachial-arteries-or-post-mastectomy-scarring",
            "destination": "/articles/false-low-blood-pressure-reading-causes",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-ways-to-anchor-your-glycemic-response-before-entering-a-relative-s-kitchen-for-adults-54-68-with-insulin-resistance-and-high-postprandial-triglycerides",
            "destination": "/articles/pre-kitchen-glycemic-anchoring-insulin-resistance",
            "permanent": true
        },
        {
            "source": "/articles/why-your-blood-glucose-monitor-readings-jump-after-a-15-minute-hot-bath-and-what-to-do-instead-for-accurate-tracking-in-adults-67-83-with-peripheral-neuropathy-and-poor-capillary-flow",
            "destination": "/articles/hot-bath-affects-glucose-monitor-accuracy",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-stable-a1c-and-rising-fasting-glucose-especially-in-adults-68-84-with-type-2-diabetes-chronic-kidney-disease-stage-3-and-declining-albumin",
            "destination": "/articles/a1c-reliability-with-low-albumin",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-insulin-pump-site-is-causing-localized-lipohypertrophy-even-if-you-rotate-religiously-in-adults-60-with-long-term-pump-use-and-reduced-skin-elasticity",
            "destination": "/articles/insulin-pump-lipohypertrophy-warning-signs",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-managing-brittle-glucose-patterns-in-adults-55-69-with-type-1-diabetes-autonomic-neuropathy-and-frequent-unexplained-hypoglycemia",
            "destination": "/articles/brittle-diabetes-autonomic-neuropathy-guide",
            "permanent": true
        },
        {
            "source": "/articles/the-complete-guide-to-interpreting-ambulatory-blood-pressure-reports-especially-for-adults-64-with-nocturnal-non-dipping-sleep-apnea-and-fragmented-rem-cycles",
            "destination": "/articles/interpreting-ambulatory-blood-pressure-reports-sleep-apnea",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-lower-pulmonary-capillary-wedge-pressure-using-posture-diaphragmatic-positioning-and-expiratory-resistance-for-adults-68-with-orthopnea-and-preserved-ef",
            "destination": "/articles/lower-pulmonary-capillary-wedge-pressure-orthopnea",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-pancreatic-acinar-cell-function-and-reduce-postprandial-lipase-deficiency-in-adults-65-with-long-standing-type-2-diabetes-and-fatty-pancreas-imaging",
            "destination": "/articles/pancreatic-acinar-support-for-diabetics",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-counteract-holiday-nighttime-glucose-spikes-without-medication-focused-on-evening-walking-timing-foot-temperature-and-cinnamon-bioavailability",
            "destination": "/articles/natural-glucose-control-holiday-seniors",
            "permanent": true
        },
        {
            "source": "/articles/how-indoor-fireplace-smoke-alters-endothelial-nitric-oxide-synthase-activity-and-worsens-post-meal-glucose-uptake-in-adults-71-with-type-2-diabetes-and-copd",
            "destination": "/articles/fireplace-smoke-glucose-uptake-seniors-copd",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-grade-gum-inflammation-alters-endothelial-nitric-oxide-synthase-coupling-in-adults-64-80-with-stage-1-hypertension-and-mild-periodontitis",
            "destination": "/articles/gum-inflammation-endothelial-nitric-oxide-synthase-coupling",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-dose-proton-pump-inhibitor-use-reduces-gastric-intrinsic-factor-and-worsens-vitamin-b12-dependent-homocysteine-metabolism-in-adults-66-82-with-type-2-diabetes-and-peripheral-neuropathy",
            "destination": "/articles/ppi-use-vitamin-b12-neuropathy-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-dose-aspirin-use-alters-prostacyclin-thromboxane-balance-and-worsens-peripheral-vasoconstriction-in-adults-68-83-with-hypertension-and-claudication",
            "destination": "/articles/low-dose-aspirin-prostacyclin-thromboxane-vasoconstriction",
            "permanent": true
        },
        {
            "source": "/articles/does-daily-20-minute-forest-bathing-shinrin-yoku-improve-endothelial-progenitor-cell-mobilization-in-men-60-75-with-stage-1-hypertension-and-low-cd34-vegfr2-counts",
            "destination": "/articles/forest-bathing-endothelial-progenitor-cells-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/does-adding-2-grams-of-inulin-fos-daily-improve-postprandial-glp-1-and-pyy-secretion-in-adults-59-71-with-prediabetes-low-fiber-diets-and-recent-weight-regain",
            "destination": "/articles/inulin-fos-for-glp-1-in-prediabetes",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-evening-magnesium-threonate-vs-morning-magnesium-glycinate-for-improving-nocturnal-bp-dipping-in-women-66-79-with-non-dipping-pattern-and-sleep-fragmentation",
            "destination": "/articles/magnesium-threonate-vs-glycinate-nocturnal-bp-dipping",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-evening-8-p-m-tart-cherry-juice-montmorency-vs-nighttime-10-p-m-low-dose-melatonin-0-5-mg-for-improving-nocturnal-glucose-stability-in-women-61-75-with-sleep-fragmentation-and-type-2-diabetes",
            "destination": "/articles/tart-cherry-vs-melatonin-for-nighttime-glucose",
            "permanent": true
        },
        {
            "source": "/articles/10-foods-that-activate-sirt1-to-enhance-enos-acetylation-and-improve-flow-mediated-dilation-in-adults-65-80-with-endothelial-dysfunction-and-normal-ldl",
            "destination": "/articles/sirt1-activating-foods-endothelial-dysfunction-flow-mediated-dilation",
            "permanent": true
        },
        {
            "source": "/articles/when-to-suspect-autoimmune-latent-autoimmune-diabetes-in-adults-lada-in-men-52-64-with-rapid-sulfonylurea-failure-low-c-peptide-and-personal-history-of-hashimoto-s",
            "destination": "/articles/lada-diagnosis-in-middle-aged-men",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-the-impact-of-long-term-metformin-use-on-mitochondrial-dna-copy-number-in-skeletal-muscle-of-adults-62-78-with-type-2-diabetes-and-low-vo-max",
            "destination": "/articles/metformin-mitochondrial-dna-copy-number",
            "permanent": true
        },
        {
            "source": "/articles/the-ultimate-guide-to-interpreting-late-night-home-blood-pressure-dips-in-adults-with-sleep-apnea-and-mild-cognitive-impairment-including-when-normal-dipping-is-actually-harmful",
            "destination": "/articles/nocturnal-bp-dip-sleep-apnea-mild-cognitive-impairment",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-arterial-elasticity-without-medication-focusing-on-elastin-cross-link-breakers-copper-dependent-loxl1-activity-and-collagen-iv-synthesis-in-adults-61-76-with-isolated-systolic-hypertension",
            "destination": "/articles/arterial-elasticity-natural-support-isolated-systolic-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/natural-remedies-for-high-blood-pressure-in-adults-with-chronic-kidney-disease-stage-3-focusing-on-uremic-toxin-clearance-klotho-enhancement-and-gut-microbiome-derived-tmao-modulation",
            "destination": "/articles/natural-remedies-high-blood-pressure-chronic-kidney-disease",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-my-blood-sugar-is-fine-because-my-cgm-shows-flat-lines-especially-for-adults-over-65-with-sluggish-interstitial-fluid-turnover-and-delayed-glucose-signal",
            "destination": "/articles/cgm-flat-line-myth-elderly",
            "permanent": true
        },
        {
            "source": "/articles/how-indoor-winter-light-deprivation-alters-retinal-dopamine-signaling-and-disrupts-hepatic-glucose-production-rhythms-in-adults-64-80-with-type-2-diabetes-and-seasonal-affective-symptoms",
            "destination": "/articles/winter-light-deprivation-glucose-rhythm",
            "permanent": true
        },
        {
            "source": "/articles/how-indoor-barometric-pressure-drops-below-1005-hpa-increase-ambulatory-systolic-load-in-adults-63-82-with-hypertensive-heart-disease-and-left-atrial-enlargement",
            "destination": "/articles/barometric-pressure-drop-systolic-load-hypertensive-heart-disease",
            "permanent": true
        },
        {
            "source": "/articles/best-walking-surfaces-for-maximizing-plantar-pressure-stimulation-and-glucose-uptake-in-adults-70-with-type-2-diabetes-flat-feet-and-reduced-ankle-proprioception",
            "destination": "/articles/best-walking-surface-for-diabetic-glucose",
            "permanent": true
        },
        {
            "source": "/articles/5-things-everyone-over-68-should-know-about-using-continuous-glucose-monitors-during-holiday-travel-especially-with-airport-body-scanners-and-cabin-pressure-changes",
            "destination": "/articles/cgm-travel-holiday-airport-seniors",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-ways-to-restore-normal-bp-variability-not-just-lower-average-bp-in-adults-58-74-with-diabetes-and-elevated-sdnn-on-24-hour-holter-monitoring",
            "destination": "/articles/restore-blood-pressure-variability-diabetes-sdnn",
            "permanent": true
        },
        {
            "source": "/articles/10-foods-that-activate-ampk-in-adipose-tissue-to-reduce-inflammatory-adipokine-release-backed-by-subcutaneous-fat-biopsy-data-in-adults-57-73-with-obesity-and-type-2-diabetes",
            "destination": "/articles/ampk-activating-foods-for-adipose-inflammation",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-normalize-post-meal-salivary-amylase-activity-a-forgotten-lever-for-starch-digestion-in-adults-over-71-with-denture-related-chewing-changes",
            "destination": "/articles/salivary-amylase-holiday-seniors",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-my-blood-pressure-is-normal-because-my-arm-cuff-reads-fine-in-adults-with-severe-peripheral-artery-disease-and-calcified-brachial-arteries",
            "destination": "/articles/pseudohypertension-peripheral-artery-disease",
            "permanent": true
        },
        {
            "source": "/articles/how-intermittent-nighttime-light-exposure-disrupts-cardiac-clock-gene-expression-bmal1-per2-in-adults-59-73-with-shift-work-history-and-elevated-nt-probnp",
            "destination": "/articles/nighttime-light-exposure-cardiac-clock-genes-elders",
            "permanent": true
        },
        {
            "source": "/articles/does-adding-1-gram-of-cocoa-flavanols-daily-improve-endothelial-dependent-vasodilation-in-adults-63-79-with-metabolic-syndrome-and-non-alcoholic-fatty-liver",
            "destination": "/articles/cocoa-flavanols-endothelial-function-fatty-liver",
            "permanent": true
        },
        {
            "source": "/articles/5-things-everyone-over-72-should-know-about-using-home-ecg-devices-with-pacemakers-and-atrial-flutter-especially-if-you-re-taking-apixaban-or-rivaroxaban",
            "destination": "/articles/home-ecg-devices-with-pacemakers-and-anticoagulants",
            "permanent": true
        },
        {
            "source": "/articles/5-things-everyone-over-72-should-know-about-using-chest-worn-ecg-devices-during-air-travel-especially-with-pacemaker-dependent-bradycardia-and-frequent-cabin-pressure-changes",
            "destination": "/articles/chest-ecg-devices-air-travel-pacemaker-dependent",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-ways-to-reverse-early-left-ventricular-hypertrophy-without-medication-focused-on-diastolic-filling-time-sodium-timing-and-evening-magnesium-glycinate-dosing",
            "destination": "/articles/reverse-left-ventricular-hypertrophy-without-medication",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-ways-to-reduce-left-ventricular-stiffness-without-medication-focusing-on-titin-phosphorylation-sodium-intake-timing-and-deep-exhalation-duration",
            "destination": "/articles/reduce-left-ventricular-stiffness-without-medication",
            "permanent": true
        },
        {
            "source": "/articles/10-foods-that-activate-nrf2-pathway-to-reduce-oxidative-stress-in-coronary-endothelium-backed-by-microvascular-reactivity-testing-in-adults-62-76-with-microvascular-angina",
            "destination": "/articles/nrf2-activating-foods-microvascular-angina-elders",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-daily-12-minute-guided-imagery-sessions-and-left-atrial-volume-regression-in-adults-60-74-with-persistent-afib-and-hypertension",
            "destination": "/articles/guided-imagery-left-atrial-volume-afib-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/what-causes-post-exercise-blood-pressure-rebound-a-sudden-25-mmhg-systolic-rise-45-minutes-after-moderate-walking-in-adults-71-84-with-orthostatic-hypotension",
            "destination": "/articles/post-exercise-blood-pressure-rebound-in-elderly",
            "permanent": true
        },
        {
            "source": "/articles/the-ultimate-guide-to-navigating-holiday-buffets-with-age-related-satiety-hormone-decline-including-visual-cues-plate-size-and-protein-first-sequencing",
            "destination": "/articles/holiday-buffet-seniors-satiety-hormones",
            "permanent": true
        },
        {
            "source": "/articles/the-ultimate-guide-to-interpreting-postprandial-glucose-trends-on-your-cgm-including-what-flatline-spike-and-drop-and-delayed-rise-really-mean-for-your-beta-cell-reserve",
            "destination": "/articles/cgm-postprandial-patterns-beta-cell-reserve",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-endothelial-nitric-oxide-synthase-activity-in-8-12-weeks-using-beetroot-timing-sunlight-exposure-and-arginine-citrulline-cycling",
            "destination": "/articles/boost-nitric-oxide-naturally-seniors",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-modulate-the-sympathetic-parasympathetic-switch-point-in-adults-with-heart-failure-and-preserved-ejection-fraction-focusing-on-expiratory-time-foot-temperature-and-evening-light-exposure",
            "destination": "/articles/sympathetic-parasympathetic-switch-point-heart-failure",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-10-minute-seated-tai-chi-vs-guided-progressive-muscle-relaxation-for-reducing-nighttime-systolic-spikes-in-women-63-75-with-insomnia-and-nocturnal-hypertension",
            "destination": "/articles/tai-chi-vs-muscle-relaxation-for-nocturnal-hypertension",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-normalize-nocturnal-bp-dipping-using-bedroom-temperature-pillow-height-and-supine-breathing-rhythm-for-adults-70-with-non-dipping-patterns",
            "destination": "/articles/normalize-nocturnal-blood-pressure-dipping",
            "permanent": true
        },
        {
            "source": "/articles/how-intermittent-fasting-windows-shift-during-family-gatherings-and-why-a-10-a-m-to-6-p-m-schedule-may-backfire-for-women-59-69-with-insulin-resistance",
            "destination": "/articles/intermittent-fasting-during-family-events",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-ways-to-reduce-postprandial-glucose-spikes-without-medication-focused-on-meal-sequencing-chewing-pace-and-gastric-emptying-modulation",
            "destination": "/articles/reduce-postprandial-glucose-without-medication",
            "permanent": true
        },
        {
            "source": "/articles/why-does-heart-rate-recovery-after-6-minute-walk-testing-predict-5-year-mortality-better-than-peak-vo-in-adults-75-with-heart-failure-with-preserved-ejection-fraction",
            "destination": "/articles/heart-rate-recovery-and-hfpef-mortality",
            "permanent": true
        },
        {
            "source": "/articles/what-are-the-earliest-changes-in-skin-elasticity-and-wound-healing-that-signal-subclinical-microvascular-damage-in-women-over-65-with-long-standing-diabetes",
            "destination": "/articles/skin-elasticity-changes-in-elderly-diabetic-women",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-calibrate-your-home-blood-pressure-cuff-using-the-triple-reading-posture-reset-validated-in-adults-with-arthritis-and-limited-shoulder-mobility",
            "destination": "/articles/home-bp-cuff-calibration-arthritis-mobility",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-enhance-myocardial-nitric-oxide-synthase-coupling-without-l-arginine-using-beetroot-derived-nitrate-exercise-timing-and-oral-microbiome-support-in-sedentary-adults-68",
            "destination": "/articles/nitric-oxide-coupling-without-l-arginine",
            "permanent": true
        },
        {
            "source": "/articles/when-should-you-suspect-cardiac-amyloidosis-in-adults-over-72-with-unexplained-left-ventricular-hypertrophy-and-which-biomarkers-add-value-beyond-nt-probnp",
            "destination": "/articles/cardiac-amyloidosis-diagnosis-in-elderly",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-holiday-hydration-plan-e-g-herbal-teas-broth-infused-water-is-diluting-sodium-especially-if-you-re-on-diuretics-or-have-hyponatremia-history",
            "destination": "/articles/holiday-hydration-hyponatremia-seniors-diuretics",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-mitochondrial-biogenesis-in-cardiac-myocytes-after-age-65-using-fasting-mimicking-diets-cold-water-immersion-timing-and-specific-flavonoid-dosing",
            "destination": "/articles/mitochondrial-biogenesis-heart-aging",
            "permanent": true
        },
        {
            "source": "/articles/how-intermittent-silence-exposure-not-just-meditation-modulates-vagal-tone-and-reduces-nighttime-bp-surge-in-adults-61-77-with-non-dipping-hypertension",
            "destination": "/articles/intermittent-silence-and-non-dipping-bp",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-home-based-ecg-patch-monitoring-zio-xt-vs-ambulatory-holter-for-detecting-asymptomatic-atrial-fibrillation-burden-in-adults-60-79-with-controlled-hypertension",
            "destination": "/articles/ecg-patch-vs-holter-asymptomatic-afib",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-ways-to-improve-endothelial-function-within-14-days-without-exercise-or-dietary-restriction-in-sedentary-adults-67-81-with-normal-bmi-but-elevated-hs-crp",
            "destination": "/articles/improve-endothelial-function-without-exercise",
            "permanent": true
        },
        {
            "source": "/articles/the-ultimate-guide-to-holiday-eating-for-adults-with-late-stage-macular-degeneration-focusing-on-meal-visibility-texture-cues-and-nutrient-dense-low-vision-adaptations",
            "destination": "/articles/holiday-eating-macular-degeneration",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-my-glucose-is-fine-because-my-fasting-number-is-normal-why-this-misses-postprandial-hyperglycemia-oxidative-stress-and-endothelial-dysfunction",
            "destination": "/articles/fasting-glucose-myth-postprandial-risk",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-i-ll-just-skip-my-insulin-today-so-i-can-enjoy-pie-what-actually-happens-to-beta-cell-stress-in-adults-with-long-standing-type-2-diabetes",
            "destination": "/articles/skip-insulin-holiday-pie-beta-cell-stress",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-gum-infections-alter-coronary-artery-endothelial-function-in-adults-58-74-with-stable-angina-new-imaging-evidence-from-the-periodont-heart-trial",
            "destination": "/articles/gum-disease-and-coronary-artery-function",
            "permanent": true
        },
        {
            "source": "/articles/10-things-you-should-know-about-alcohol-free-mulled-wine-for-blood-sugar-control-including-tannin-content-spice-synergy-and-serving-temperature-effects",
            "destination": "/articles/alcohol-free-mulled-wine-blood-sugar",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-low-glycemic-holiday-desserts-made-with-date-paste-do-they-really-reduce-glycemic-load-or-just-mask-rapid-fructose-absorption-in-adults-with-nafld",
            "destination": "/articles/date-paste-desserts-glycemic-load-nafld-seniors",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-support-salivary-amylase-production-during-holiday-meals-without-supplements-for-adults-75-with-age-related-xerostomia-and-early-dysphagia",
            "destination": "/articles/salivary-amylase-holiday-meals-xerostomia-seniors",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-grade-inflammation-from-periodontitis-drives-postprandial-hyperglycemia-in-adults-with-long-standing-diabetes-and-why-scaling-alone-isn-t-enough",
            "destination": "/articles/periodontitis-postprandial-hyperglycemia",
            "permanent": true
        },
        {
            "source": "/articles/12-science-backed-ways-to-reduce-glucose-variability-in-shift-workers-with-type-2-diabetes-based-on-circadian-realignment-meal-timing-and-light-exposure-protocols",
            "destination": "/articles/glucose-variability-shift-workers",
            "permanent": true
        },
        {
            "source": "/articles/the-ultimate-guide-to-managing-diabetes-while-caring-for-a-spouse-with-moderate-dementia-focusing-on-medication-safety-meal-simplification-and-cognitive-load-reduction",
            "destination": "/articles/diabetes-management-dementia-caregiver-20260104",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-improve-insulin-sensitivity-in-skeletal-muscle-without-exercise-using-cold-exposure-postprandial-standing-and-diurnal-blue-light-timing-in-sedentary-adults-70",
            "destination": "/articles/insulin-sensitivity-without-exercise-elderly",
            "permanent": true
        },
        {
            "source": "/articles/5-things-everyone-with-type-1-diabetes-over-60-should-know-before-starting-a-plant-based-diet-especially-with-concurrent-gastroparesis-or-hypothyroidism",
            "destination": "/articles/type-1-diabetes-plant-based-diet-over-60",
            "permanent": true
        },
        {
            "source": "/articles/12-holiday-foods-that-stabilize-blood-glucose-during-the-meal-not-just-after-with-glycemic-index-modifiers-fiber-synergy-and-timing-rules-for-adults-65",
            "destination": "/articles/holiday-foods-stabilize-blood-glucose-during-meal",
            "permanent": true
        },
        {
            "source": "/articles/the-ultimate-guide-to-adjusting-antihypertensive-dosing-during-summer-heatwaves-with-hydration-thresholds-diuretic-timing-and-postural-rehydration-protocols",
            "destination": "/articles/antihypertensive-dosing-summer-heatwaves",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-adjust-your-holiday-plate-for-early-stage-macular-degeneration-focusing-on-lutein-bioavailability-fat-pairing-and-light-induced-oxidation-risks",
            "destination": "/articles/holiday-eating-macular-degeneration-lutein-bioavailability",
            "permanent": true
        },
        {
            "source": "/articles/best-footwear-modifications-for-adults-with-diabetes-and-charcot-arthropathy-based-on-dynamic-pressure-mapping-and-3d-gait-analysis-in-92-patients-over-65",
            "destination": "/articles/charcot-arthropathy-footwear-modifications",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-slow-cooked-holiday-leftovers-vs-reheated-microwave-portions-which-preserves-more-bioavailable-zinc-and-magnesium-for-seniors-with-atrophic-gastritis",
            "destination": "/articles/reheating-holiday-leftovers-mineral-bioavailability-seniors",
            "permanent": true
        },
        {
            "source": "/articles/warning-signs-your-holiday-healthy-swap-e-g-coconut-flour-cookies-is-accelerating-postprandial-triglyceride-rich-lipoprotein-production-in-adults-with-diabetic-dyslipidemia",
            "destination": "/articles/holiday-healthy-swap-triglyceride-lipoprotein",
            "permanent": true
        },
        {
            "source": "/articles/the-ultimate-guide-to-adjusting-rapid-acting-insulin-dosing-for-multi-course-holiday-dinners-with-carb-counting-fat-protein-factor-and-alcohol-adjustment-rules",
            "destination": "/articles/rapid-acting-insulin-holiday-dinner-dosing",
            "permanent": true
        },
        {
            "source": "/articles/best-strength-training-modifications-for-adults-with-diabetes-and-peripheral-neuropathy-based-on-pressure-mapping-and-gait-analysis-in-187-patients-over-60",
            "destination": "/articles/strength-training-peripheral-neuropathy-seniors",
            "permanent": true
        },
        {
            "source": "/articles/quick-ways-to-normalize-post-holiday-glucose-variability-within-72-hours-using-targeted-magnesium-glycinate-and-alpha-lipoic-acid-validated-in-adults-67-81",
            "destination": "/articles/normalize-glucose-variability-72-hours-magnesium",
            "permanent": true
        },
        {
            "source": "/articles/natural-ways-to-improve-microvascular-coronary-reactivity-without-nitroglycerin-backed-by-5-rcts-in-women-52-68-with-inoca-ischemia-with-no-obstructive-cad",
            "destination": "/articles/microvascular-coronary-reactivity-natural",
            "permanent": true
        },
        {
            "source": "/articles/how-holiday-sleep-fragmentation-especially-late-night-gift-wrapping-or-midnight-mass-attendance-disrupts-nocturnal-growth-hormone-pulses-and-fasting-glucose-in-men-over-70",
            "destination": "/articles/holiday-sleep-fragmentation-fasting-glucose-men",
            "permanent": true
        },
        {
            "source": "/articles/what-research-says-about-high-intensity-interval-training-hiit-vs-continuous-moderate-exercise-for-pulse-pressure-widening-in-adults-52-66-with-prehypertension",
            "destination": "/articles/hiit-vs-walking-pulse-pressure-prehypertension",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-slow-cooked-herb-roasted-turkey-breast-vs-deep-fried-turkey-leg-which-preserves-more-bioavailable-zinc-and-supports-immune-resilience-in-seniors-with-low-serum-zinc",
            "destination": "/articles/turkey-preparation-zinc-bioavailability-seniors",
            "permanent": true
        },
        {
            "source": "/articles/simple-steps-to-adjust-your-cardiac-rehab-routine-for-post-covid-myocardial-fatigue-especially-if-you-re-over-70-and-experienced-subclinical-troponin-elevation",
            "destination": "/articles/cardiac-rehab-post-covid-myocardial-fatigue",
            "permanent": true
        },
        {
            "source": "/articles/how-social-dancing-twice-weekly-alters-cardiac-autonomic-tone-and-reduces-glycemic-variability-in-adults-with-diabetes-and-mild-orthostatic-hypotension",
            "destination": "/articles/social-dancing-glycemic-variability-orthostatic-hypotension",
            "permanent": true
        },
        {
            "source": "/articles/how-chronic-low-grade-inflammation-from-gum-disease-accelerates-coronary-artery-calcification-in-adults-55-69-with-normal-ldl-and-why-dentists-are-the-first-line-of-defense",
            "destination": "/articles/gum-disease-and-coronary-artery-calcification",
            "permanent": true
        },
        {
            "source": "/articles/does-your-blood-glucose-monitor-interact-with-common-iron-supplements-differently-after-age-66-a-safety-guide-for-ferritin-replete-seniors-on-metformin",
            "destination": "/articles/blood-glucose-monitor-iron-supplement-interference",
            "permanent": true
        },
        {
            "source": "/articles/can-you-reverse-mild-left-ventricular-hypertrophy-with-resistance-training-alone-evidence-from-6-rcts-in-sedentary-men-60-72-with-controlled-hypertension",
            "destination": "/articles/resistance-training-left-ventricular-hypertrophy",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-daily-low-dose-aspirin-initiation-at-age-55-vs-age-65-for-primary-prevention-what-the-2024-uspstf-reanalysis-says-about-net-benefit-in-adults-with-cac-score-100",
            "destination": "/articles/aspirin-primary-prevention-cacs-score",
            "permanent": true
        },
        {
            "source": "/articles/7-hidden-medication-interactions-that-elevate-heart-failure-readmission-risk-within-30-days-of-hospital-discharge-especially-in-adults-75-with-polypharmacy",
            "destination": "/articles/medication-interactions-heart-failure-readmission",
            "permanent": true
        },
        {
            "source": "/articles/the-ultimate-guide-to-interpreting-continuous-glucose-monitoring-cgm-reports-for-adults-with-diabetes-and-early-dementia-what-time-in-range-alone-doesn-t-tell-you",
            "destination": "/articles/cgm-interpretation-early-dementia-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/the-truth-about-diabetes-friendly-protein-bars-why-82-contain-hidden-maltitol-that-slows-gastric-emptying-and-blunts-postprandial-glp-1-in-adults-60-75",
            "destination": "/articles/diabetes-friendly-protein-bars-hidden-ingredients",
            "permanent": true
        },
        {
            "source": "/articles/myths-vs-facts-normal-fasting-glucose-readings-in-adults-with-diabetes-and-chronic-kidney-disease-stage-3a-why-your-lab-may-be-missing-early-glycemic-dysregulation",
            "destination": "/articles/fasting-glucose-ckd-stage-3a-diabetes",
            "permanent": true
        },
        {
            "source": "/articles/how-intermittent-fasting-before-a-family-gathering-affects-cardiac-autonomic-tone-in-adults-with-diastolic-dysfunction-new-data-from-a-2024-pilot-cohort",
            "destination": "/articles/intermittent-fasting-diastolic-dysfunction-hr",
            "permanent": true
        },
        {
            "source": "/articles/5-things-everyone-over-65-should-know-before-eating-a-traditional-holiday-ham-including-nitrate-sensitivity-sulfite-reactions-and-renal-clearance-rates",
            "destination": "/articles/holiday-ham-safety-over-65",
            "permanent": true
        },
        {
            "source": "/articles/why-sudden-cold-exposure-at-holiday-open-houses-can-trigger-paroxysmal-afib-in-adults-with-subclinical-aortic-stiffness-and-what-to-do-within-90-seconds",
            "destination": "/articles/cold-exposure-and-paroxysmal-afib-in-elderly",
            "permanent": true
        },
        {
            "source": "/articles/when-to-worry-about-blood-pressure-dropping-only-during-walking-a-red-flag-pattern-for-autonomic-neuropathy-in-adults-with-long-standing-diabetes-over-67",
            "destination": "/articles/blood-pressure-drops-walking-diabetes-neuropathy",
            "permanent": true
        },
        {
            "source": "/articles/a-vs-b-slow-cooked-collard-greens-with-smoked-turkey-leg-vs-instant-pot-greens-with-liquid-aminos-which-is-safer-for-heart-failure-patients-on-diuretics",
            "destination": "/articles/collard-greens-heart-failure-diuretics-comparison",
            "permanent": true
        }
    ];
    return slugRedirects;
  },
};

module.exports = nextConfig;
