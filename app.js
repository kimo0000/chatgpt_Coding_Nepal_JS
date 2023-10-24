const chatgptEl = document.querySelector(".chatgpt");
const chatbox = document.querySelector(".chatbox");
const textArea = document.querySelector("#text_inp");
const btnSend = document.querySelector(".send");
const btnsMode = document.querySelector(".btn_mode");
const btnDelete = document.querySelector(".btn_delete");

let userMsg;
const OPENAI_API_KEY = "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";
const inialHeight = textArea.scrollHeight;

const localStorageItem = () => {
  let themeColor = localStorage.getItem("themeChatgpt");
  chatgptEl.classList.toggle(
    "change_mode",
    themeColor === '<i class="fa-regular fa-sun light"></i>'
  );
  btnsMode.innerHTML = chatgptEl.classList.contains("change_mode")
    ? '<i class="fa-regular fa-moon dark"></i>'
    : '<i class="fa-regular fa-sun light"></i>';

  const defaultText = `<div class="default_text">
                          <h1>ChatGpt Clone</h1>
                          <p>
                             Start A Conversation With Chatgpt ! 
                          </p>
                      </div>`;

  chatbox.innerHTML = localStorage.getItem("contentChatbox") || defaultText;
  chatbox.scrollTo(0, chatbox.scrollHeight);
};

localStorageItem();

const generateChatGpt = async (outcomingChat) => {
  const urlRequest = `https://api.openai.com/v1/completions`;
  const apiRequest = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-instruct",
      prompt: userMsg,
      max_tokens: 2048,
      temperature: 0.2,
      stop: null,
    }),
  };
  try {
    const res = await (await fetch(urlRequest, apiRequest)).json();
    outcomingChat.querySelector("p").innerText = res.choices[0].text.trim();
    chatbox.scrollTo(0, chatbox.scrollHeight);
    localStorage.setItem("contentChatbox", chatbox.innerHTML);
  } catch (error) {
    outcomingChat.querySelector(
      "p"
    ).innerText = `Ooops, Something Is Wrong Please Try A gain !`;
    outcomingChat.querySelector(".dots").classList.add("error");
  }
};

const createLi = (html, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add(className);
  chatLi.innerHTML = html;
  return chatLi;
};

const handleChat = () => {
  userMsg = textArea.value.trim();
  if (!userMsg) return;
  textArea.value = "";
  textArea.style.height = `${inialHeight}px`;
  console.log(inialHeight);

  const html = `<img src="imgs/Cartoonify (2).png" alt="image cartoon">
                <p></p>`;

  const incomingChat = createLi(html, "incoming");
  incomingChat.querySelector("p").innerText = userMsg;
  chatbox.appendChild(incomingChat);
  document.querySelector(".default_text")?.remove();
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const html = `<div class="parent_copy_btn">
                <i onclick="copyBtn(this)" class="fa-regular fa-copy copy_btn"></i>
                </div>
                <i class="fa-solid fa-robot robo_face"></i>
                <p class="dots">
                    <span class="dot_one" style="--delay: 0.2s"></span>
                    <span class="dot_two" style="--delay: 0.3s"></span>
                    <span class="dot_three" style="--delay: 0.4s"></span>
                </p>`;

    const outcomingChat = createLi(html, "outcoming");
    chatbox.appendChild(outcomingChat);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateChatGpt(outcomingChat);
  }, 500);
};

const copyBtn = (btn) => {
  console.log(btn);
  const elementCopyBtn = btn.parentElement.parentElement.querySelector("p");
  console.log(elementCopyBtn);
  navigator.clipboard.writeText(elementCopyBtn.textContent);
  document.querySelector(
    ".parent_copy_btn"
  ).innerHTML = `<i class="fa-solid fa-check"></i>`;
  setTimeout(() => {
    document.querySelector(
      ".parent_copy_btn"
    ).innerHTML = `<i onclick="copyBtn(this)" class="fa-regular fa-copy copy_btn"></i>`;
  }, 1000);
};

btnSend.addEventListener("click", handleChat);

textArea.addEventListener("input", () => {
  textArea.style.height = `${inialHeight}px`;
  textArea.style.height = `${textArea.scrollHeight}px`;
});

textArea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});

btnsMode.addEventListener("click", () => {
  chatgptEl.classList.toggle("change_mode");
  btnsMode.innerHTML = chatgptEl.classList.contains("change_mode")
    ? '<i class="fa-regular fa-moon dark"></i>'
    : '<i class="fa-regular fa-sun light"></i>';
  localStorage.setItem("themeChatgpt", btnsMode.innerHTML);
});

btnDelete.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete This chat ?")) {
    localStorage.removeItem("contentChatbox");
    localStorageItem();
  }
});
