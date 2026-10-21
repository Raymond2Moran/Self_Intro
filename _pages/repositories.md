---
layout: page
permalink: /repositories/
title: repositories
description:
nav: true
nav_order: 4
---

## GitHub

Explore my public repositories, code, and contributions on GitHub.

{% for user in site.data.repositories.github_users %}
- [{{ user }} on GitHub](https://github.com/{{ user }})
{% endfor %}

### Stats and activity

My public GitHub statistics and contribution activity, provided by [GHStats](https://ghstats.dev/).

{% for user in site.data.repositories.github_users %}
<figure class="github-activity-chart">
  <a href="https://github.com/{{ user }}">
    <img
      src="https://ghstats.dev/api/card?username={{ user | uri_escape }}&amp;theme=light"
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
      src="https://ghstats.dev/api/sparkline?username={{ user | uri_escape }}&amp;days=30&amp;width=420"
      alt="{{ user }}'s GitHub contribution sparkline for the past 30 days"
      loading="lazy"
      decoding="async"
    >
  </a>
  <figcaption>Contribution activity over the past 30 days.</figcaption>
</figure>

[View {{ user }}'s activity directly on GitHub](https://github.com/{{ user }}?tab=overview).
{% endfor %}
