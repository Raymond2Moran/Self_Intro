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
