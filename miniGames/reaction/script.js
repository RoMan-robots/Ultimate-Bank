const game = { timer: 0, start: null };

// Create Message Element
const message = document.createElement("div");
message.classList.add("message");
message.textContent = "Натисніть, щоб почати";
document.body.prepend(message);

const button = document.createElement("button");
button.textContent = "Вийти";
document.body.prepend(button);
button.addEventListener("click", () => {
    window.location.href = "/miniGames";
});

// Create a Box
const box = document.createElement("div");
box.classList.add("box");

const output = document.querySelector(".output");
output.append(box);

box.addEventListener("click", () => {
  box.textContent = "";
  box.style.display = "none";
  game.timer = setTimeout(addBox, randomNumbers(3000));
  if (!game.start) {
    message.textContent = "Натисніть, щоб почати";
  } else {
    const current = new Date().getTime();
    const duration = (current - game.start) / 1000;
    message.innerHTML = `
    Ваш час: ${duration} секунд <br>
    Зароблено: ${calculateReward(duration)} рунів за останній раз
    `;
    reward(calculateReward(duration));
  }
});

function calculateReward(duration) {
    if (duration > 1.2) {
        return 0;
    }else if (duration < 0.5) {
        return 2.5;
    } else {
        return ((2.5 - (2.5 * (duration - 0.5)) / 3).toFixed(2));
    }
}

function reward(score) {
    const token = localStorage.getItem('token');
    if (!token || !score) {
        console.log('Invalid score')
        return
    }
    if (score <= 0) {
        return
    }
    fetch('/checkAuth', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            if (!data.isAuthenticated) {
                return
            }
            fetch(`/miniGames/reward/${score}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => response.json())
                .catch(error => {
                    console.error(error)
                })
        })
}

function randomNumbers(max) {
  return Math.floor(Math.random() * max);
}

function addBox() {
  game.start = new Date().getTime();
  const container = output.getBoundingClientRect();
  const dim = [randomNumbers(50) + 20, randomNumbers(50) + 20];
  box.style.display = "block";
  box.style.width = `${dim[0]}px`;
  box.style.height = `${dim[1]}px`;
  box.style.backgroundColor = "#" + Math.random().toString(16).substr(-6);
  box.style.left = randomNumbers(container.width - dim[0]) + "px";
  box.style.top = randomNumbers(container.height - dim[1]) + "px";
  box.style.borderRadius = randomNumbers(50) + "%";
}