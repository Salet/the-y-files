import { test } from '@playwright/test';

test('write a note', async ({ page }) => {
	await page.goto('http://localhost:5173/note/test-note');
	await page.locator('.ql-editor').pressSequentially(text, { delay: 200 });
});

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At elementum eu facilisis sed odio morbi quis. Nullam eget felis eget nunc lobortis mattis aliquam faucibus. Consectetur a erat nam at lectus. Netus et malesuada fames ac turpis egestas. Viverra orci sagittis eu volutpat odio facilisis. Laoreet non curabitur gravida arcu ac. Varius sit amet mattis vulputate. Ut aliquam purus sit amet luctus venenatis. Fringilla urna porttitor rhoncus dolor. Commodo elit at imperdiet dui accumsan sit.

Gravida cum sociis natoque penatibus et. Convallis posuere morbi leo urna molestie at elementum eu facilisis. Montes nascetur ridiculus mus mauris vitae ultricies leo integer. Eget egestas purus viverra accumsan in nisl nisi. Feugiat in ante metus dictum. Tristique magna sit amet purus gravida. Lectus mauris ultrices eros in. Quam nulla porttitor massa id neque aliquam vestibulum morbi blandit. Consectetur libero id faucibus nisl tincidunt eget nullam non. Rhoncus mattis rhoncus urna neque viverra justo. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Nunc consequat interdum varius sit amet mattis. Et malesuada fames ac turpis egestas. Suspendisse in est ante in nibh mauris cursus. Integer eget aliquet nibh praesent tristique magna sit. Purus non enim praesent elementum.

Ac turpis egestas maecenas pharetra convallis. Consequat ac felis donec et odio. Dignissim cras tincidunt lobortis feugiat vivamus. Quis auctor elit sed vulputate mi sit amet mauris. Dignissim enim sit amet venenatis urna. Ultricies mi eget mauris pharetra et ultrices. Ipsum dolor sit amet consectetur adipiscing elit. Malesuada fames ac turpis egestas. Fringilla ut morbi tincidunt augue interdum velit. Diam quam nulla porttitor massa id neque. Viverra nam libero justo laoreet. Etiam non quam lacus suspendisse faucibus interdum posuere lorem. Vulputate dignissim suspendisse in est ante in nibh mauris. Congue eu consequat ac felis donec et odio pellentesque diam. Rhoncus urna neque viverra justo nec ultrices dui sapien. Vestibulum mattis ullamcorper velit sed ullamcorper. Dictumst quisque sagittis purus sit amet volutpat consequat mauris.

Id volutpat lacus laoreet non curabitur gravida. Adipiscing elit ut aliquam purus sit amet luctus venenatis. Ut faucibus pulvinar elementum integer enim neque volutpat. Euismod in pellentesque massa placerat duis ultricies. Neque ornare aenean euismod elementum nisi quis eleifend quam. Amet massa vitae tortor condimentum lacinia quis vel eros. Euismod quis viverra nibh cras pulvinar mattis. Dolor purus non enim praesent elementum facilisis leo vel fringilla. Purus in massa tempor nec feugiat. Faucibus turpis in eu mi. Amet facilisis magna etiam tempor orci eu lobortis. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus. Euismod lacinia at quis risus sed vulputate odio. Adipiscing bibendum est ultricies integer quis auctor. Proin sagittis nisl rhoncus mattis rhoncus urna neque viverra justo. Cursus vitae congue mauris rhoncus aenean vel. Urna neque viverra justo nec ultrices dui sapien eget. Aliquam etiam erat velit scelerisque. Diam sollicitudin tempor id eu nisl nunc mi ipsum. Nunc eget lorem dolor sed viverra ipsum nunc aliquet.

Et odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque. Scelerisque eleifend donec pretium vulputate. Diam vulputate ut pharetra sit amet aliquam. Turpis egestas maecenas pharetra convallis posuere morbi leo urna molestie. Aliquet porttitor lacus luctus accumsan tortor posuere ac. Consequat interdum varius sit amet. Eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Eget mi proin sed libero enim sed faucibus turpis. Risus ultricies tristique nulla aliquet.`;
