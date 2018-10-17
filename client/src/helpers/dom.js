const BODY_NON_SCROLLABLE_PAGE = 'non-scrollable-page';

const addClassToBody = (className) => document.body.classList.add(className);

const removeClassFromBody = (className) => document.body.classList.remove(className);

const addNonScrollableClassToBody = () => addClassToBody(BODY_NON_SCROLLABLE_PAGE);

const removeNonScrollableClassToBody = () => removeClassFromBody(BODY_NON_SCROLLABLE_PAGE);

export {
  addNonScrollableClassToBody,
  removeNonScrollableClassToBody,
  addClassToBody,
  removeClassFromBody,
}
