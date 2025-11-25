- база данных на json-server
- BFF
- редакс стор

Сущности приложения:

- пользователь: БД (список пользователей), BFF (сессия текущего), стор (отображение в браузере)

- роль пользователя: БД (список ролей), BFF (сессия пользователя с ролью), стор
  (использование на клиенте)
- статья: БД (список статей), стор (отображение в браузере)
- комментарий: БД (список комментариев), стор (отображение в браузере)

Таблицы БД:

- пользователи - users: id / login / password / registed_at / role_id
- роли - roles: id / name
- статьи - posts: id / title / image_url / content / published_at
- комментарии - comments: id / author_id / post_id I/ content

Схема для состояния на BFF:

- сессия текущего ползователя login / password / role

Схема для состояния на Redux Store (на клиенте):

- user: id / login / roleId / session
- posts: массив post : id / title / imageUrl / publishedAt / commentsCount
- post: массив post : id / title / imageUrl / content / publishedAt / comments массив comment : id / author / content / publihedAt
- users: массив user: id / login / registeredAt / role
