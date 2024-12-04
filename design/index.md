---
layout: default
title: design 

---

<div class="container">
	<div class="row">
	{% if site.posts.size > 0 %}
		{% for post in paginator.posts %}
			{% include article-content.html %}
		{% endfor %}
	{% endif %}
	</div>
</div>
{% if site.posts.size > 5 %}
	{% include pagination.html %}
{% endif %}


