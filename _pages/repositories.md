---
layout: page
permalink: /repositories/
title: projects
description:
nav: true
nav_order: 2
---

## [PharmaSUG 27](https://pharmasug.org/conferences/pharmasug-2027-us/)

Projects in development for PharmaSUG 2027, focusing on SAS programming, analysis datasets, and statistical inference.

### SAS ADaM Core Dataset Skills

Agent skills for developing and checking ADaM datasets in SAS using approved study specifications. The ADSL-first workflow covers ADSL, ADLB, ADVS, ADAE, and ADCM, with derivation traceability, independent QC expectations, and a worked synthetic study example.

[View the SAS ADaM Core Dataset Skills repository](https://github.com/Raymond2Moran/pharmasug_27_pharmaskills)

### Robust Covariate Adjustment under CAR in SAS

A SAS Viya research implementation of continuous-outcome augmented inverse probability weighting (AIPW), joint calibration, CAR variance estimation, and treatment contrasts. The repository includes analysis workflows, documentation, and comparisons against RobinCar 1.2.0.

[View the Robust Covariate Adjustment repository](https://github.com/brendazhang51/pharmasug_27)

## Featured projects

Statistical tools and research software I have developed or contributed to, spanning clinical study design and reproducible inference.

{% include featured_projects.liquid %}

## GitHub

Explore my public repositories, code, and contributions on GitHub.

{% for user in site.data.repositories.github_users %}
- [{{ user }} on GitHub](https://github.com/{{ user }})
{% endfor %}

### Stats and activity

My public GitHub statistics and contribution activity, provided by [GHStats](https://ghstats.dev/).

{% for user in site.data.repositories.github_users %}
<div class="github-activity-grid">
<figure class="github-activity-chart">
  <a href="https://github.com/{{ user }}">
    <img
      src="https://ghstats.dev/api/card?username={{ user | uri_escape }}&amp;theme=light"
      data-theme-light-src="https://ghstats.dev/api/card?username={{ user | uri_escape }}&amp;theme=light"
      data-theme-dark-src="https://ghstats.dev/api/card?username={{ user | uri_escape }}&amp;theme=tokyonight"
      width="495"
      height="430"
      alt="{{ user }}'s GitHub statistics card"
      loading="lazy"
      decoding="async"
    >
  </a>
  <figcaption>Public GitHub statistics for {{ user }}.</figcaption>
</figure>

<figure class="github-activity-chart">
  <a href="https://github.com/{{ user }}?tab=overview">
    <img
      src="https://ghstats.dev/api/sparkline?username={{ user | uri_escape }}&amp;days=30&amp;width=420&amp;theme=light"
      data-theme-light-src="https://ghstats.dev/api/sparkline?username={{ user | uri_escape }}&amp;days=30&amp;width=420&amp;theme=light"
      data-theme-dark-src="https://ghstats.dev/api/sparkline?username={{ user | uri_escape }}&amp;days=30&amp;width=420&amp;theme=tokyonight"
      width="420"
      height="80"
      alt="{{ user }}'s GitHub contribution sparkline for the past 30 days"
      loading="lazy"
      decoding="async"
    >
  </a>
  <figcaption>Contribution activity over the past 30 days.</figcaption>
</figure>
</div>

[View {{ user }}'s activity directly on GitHub](https://github.com/{{ user }}?tab=overview).
{% endfor %}
