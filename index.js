(() => {
    // создание статей которые будут выдаваться списком
    function createBlogItem({ id, title }) {
        const itemBlog = document.createElement('li');
        const itemBlogLink = document.createElement('a');
        itemBlogLink.classList.add('blog__item-link');
        itemBlogLink.href = `./single.html?id=${id}`;
        itemBlogLink.textContent = title.slice(0, 10);
        itemBlog.append(itemBlogLink);
        return itemBlog;
    }

    // создание списка для статей
    function createBlogList() {
        const blogList = document.createElement('ul');
        blogList.classList.add('blog');
        return blogList;
    }

    // создание кнопки для возврата на страницу блога
    function createBackButton () {
        const buttonBack = document.createElement('button');
        buttonBack.textContent = 'Назад';
        buttonBack.classList.add('button-back');
        buttonBack.onclick = () => {
            history.back();
        };
        return buttonBack;
    }

    // создание поста
    function createPost ({ title, body }) {
        const post = document.createElement('div');
        post.classList.add('post');

        const postTitle = document.createElement('h1');
        postTitle.classList.add('post__title');
        postTitle.textContent = title;

        const postContent = document.createElement('p');
        postContent.classList.add('post__content');
        postContent.textContent = body;

        post.append(postTitle);
        post.append(postContent);
        return post;
    }

    function createComments ({ name, email, body }) {
        const comment = document.createElement('div');
        comment.classList.add('comment');

        const nameAuthor = document.createElement('h1');
        nameAuthor.classList.add('comment__author');
        nameAuthor.textContent = name;

        const emailAuthor = document.createElement('p');
        emailAuthor.classList.add('comment__email');
        emailAuthor.textContent = email;

        const commentContent = document.createElement('p');
        commentContent.classList.add('comment__content');
        commentContent.textContent = body;

        comment.append(nameAuthor);
        comment.append(emailAuthor);
        comment.append(commentContent);
        return comment;
    }

    // создание статьи которая будет отображаться на отдельной странице
    async function createPostPage(container) {
        // кнопка для возврата назад
        const buttonBack = createBackButton();
        container.append(buttonBack);

        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');

        // получаем данные поста
        const responsePost = await fetch(`https://gorest.co.in/public-api/posts?id=${postId}`);
        const responsePostData = await responsePost.json();
        const postData = responsePostData.data;
        postData.forEach(postItem => {
            const postItemElement = createPost(postItem);
            container.append(postItemElement);
        });

        // получаем данные комментариев
        const responseComments = await fetch(`https://gorest.co.in/public-api/comments?id=${postId}`);
        const responseCommentsData = await responseComments.json();
        const commentsData = responseCommentsData.data;
        commentsData.forEach(commentsItem => {
            const commentsItemElement = createComments(commentsItem);
            container.append(commentsItemElement);
        });
    }

    function createPaginationItem(number) {
        const paginationItem = document.createElement('li');
        paginationItem.classList.add('pagination__item');

        const paginationLink = document.createElement('a');
        paginationLink.classList.add('pagination__item-link');
        paginationLink.href = `?page=${number}`;
        if (paginationLink.href == window.location.href) {
            paginationLink.removeAttribute('href');
            paginationLink.classList.add('pagination__item-link_inactive');
        }
        paginationLink.textContent = number;

        paginationItem.append(paginationLink);
        return { paginationItem, paginationLink };
    }

    function createPagination({ page, pages }) {
        // нужно будет добавить обработчики на кнопки в которых прописать изменение параметра url
        const pagination = document.createElement('ul');
        pagination.classList.add('pagination');

        // создаем страницы пагинации
        for (let i = page - 2; i <= page + 2; i++) {
            let paginationItem = createPaginationItem(i);
            pagination.appendChild(paginationItem.paginationItem);
        }

        if (page === 1) {
            pagination.firstChild.remove();
            pagination.firstChild.remove();
        } else if (page >= 2 && page < pages) {
            pagination.firstChild.remove();
            pagination.lastChild.remove();
        } else {
            pagination.lastChild.remove();
            pagination.lastChild.remove();
        }


        // создаем кнопку "prev"
        if (page > 1) {
            const paginationItem = document.createElement('li');
            paginationItem.classList.add('pagination__item');

            const prevBtn = document.createElement('a');
            prevBtn.href = `?page=${page - 1}`;
            prevBtn.classList.add('prev', 'pagination__item-link');
            prevBtn.innerHTML = '&laquo;';

            paginationItem.append(prevBtn);
            pagination.insertBefore(paginationItem, pagination.firstChild);
        }

        // создаем кнопку "next"
        if (page < pages) {
            const paginationItem = document.createElement('li');
            paginationItem.classList.add('pagination__item');

            const nextBtn = document.createElement('a');
            nextBtn.href = `?page=${page + 1}`;
            nextBtn.classList.add('next', 'pagination__item-link');
            nextBtn.innerHTML = '&raquo;';

            paginationItem.append(nextBtn);
            pagination.appendChild(paginationItem);
        }

        return pagination;
    }

    async function getBlogPage(page, container) {
        const response = await fetch(`https://gorest.co.in/public-api/posts?page=${page}`);
        const blogData = await response.json();
        const blogItemList = blogData.data;

        const blogPaginationData = blogData.meta.pagination;
        const pagination = createPagination(blogPaginationData);

        const blogList = createBlogList();
        container.append(blogList);
        container.append(pagination);

        blogItemList.forEach(blogItem => {
            const blogItemElement = createBlogItem(blogItem);
            blogList.append(blogItemElement);
        });
    }

    async function createBlogApp(container) {

        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        const pageNumber = page ? parseInt(page) : 1;
        getBlogPage(pageNumber, container);

    }

    window.createBlogApp = createBlogApp;
    window.createPostPage = createPostPage;
})();