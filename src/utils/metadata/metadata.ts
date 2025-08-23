export function setPageMetadata({title, description}: { title?: string, description?: string }) {
    if (title) {
        document.title = `Nuclear Messenger | ${title}`;
    }

    if (description) {
        let descriptionTag = document.querySelector('meta[name="description"]');

        if (!descriptionTag) {
            descriptionTag = document.createElement('meta');
            descriptionTag.setAttribute('name', 'description');
            document.head.appendChild(descriptionTag);
        }

        descriptionTag.setAttribute('content', description);
    }
}
