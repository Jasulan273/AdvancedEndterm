import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  const hashedPassword = await bcrypt.hash('password123', 10)
  console.log('Clearing database...')
  await prisma.interaction.deleteMany({})
  await prisma.book.deleteMany({})
  await prisma.user.deleteMany({})
  console.log('Database cleared!')

  console.log('Creating users...')
  const users = []
  for (let i = 1; i <= 50; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `User ${i}`,
        password: hashedPassword
      }
    })
    users.push(user)
  }

  console.log('Creating books...')
  const booksData = [
    { title: '1984', author: 'George Orwell', genre: 'Dystopian Fiction', price: 15.99, description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.', isbn: '9780451524935', publishYear: 1949, tags: ['classic', 'political', 'dystopian'] },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Southern Gothic', price: 12.99, description: 'A novel about racial injustice and the loss of innocence.', isbn: '9780061120084', publishYear: 1960, tags: ['classic', 'drama', 'american'] },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic Literature', price: 10.99, description: 'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.', isbn: '9780743273565', publishYear: 1925, tags: ['classic', 'romance', '1920s'] },
    { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', genre: 'Fantasy', price: 18.99, description: 'A young wizard discovers his magical heritage and attends Hogwarts.', isbn: '9780439708180', publishYear: 1997, tags: ['fantasy', 'young-adult', 'magic'] },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', price: 14.99, description: 'Bilbo Baggins embarks on an unexpected journey.', isbn: '9780547928227', publishYear: 1937, tags: ['fantasy', 'adventure', 'classic'] },
    { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', price: 11.99, description: 'A romantic novel about Elizabeth Bennet and Mr. Darcy.', isbn: '9780141439518', publishYear: 1813, tags: ['classic', 'romance', 'british'] },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Coming-of-age', price: 13.99, description: 'Holden Caulfield\'s journey through teenage rebellion.', isbn: '9780316769174', publishYear: 1951, tags: ['classic', 'coming-of-age'] },
    { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', price: 29.99, description: 'An epic quest to destroy the One Ring.', isbn: '9780544003415', publishYear: 1954, tags: ['fantasy', 'epic', 'adventure'] },
    { title: 'Animal Farm', author: 'George Orwell', genre: 'Political Satire', price: 9.99, description: 'An allegorical novella about Stalinism.', isbn: '9780451526342', publishYear: 1945, tags: ['classic', 'political', 'satire'] },
    { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian Fiction', price: 14.99, description: 'A dystopian novel about a futuristic World State.', isbn: '9780060850524', publishYear: 1932, tags: ['dystopian', 'sci-fi', 'classic'] },
    { title: 'The Chronicles of Narnia', author: 'C.S. Lewis', genre: 'Fantasy', price: 24.99, description: 'Seven fantasy novels set in the magical land of Narnia.', isbn: '9780066238500', publishYear: 1950, tags: ['fantasy', 'children', 'adventure'] },
    { title: 'Moby-Dick', author: 'Herman Melville', genre: 'Adventure', price: 16.99, description: 'Captain Ahab\'s obsessive quest for the white whale.', isbn: '9780142437247', publishYear: 1851, tags: ['classic', 'adventure', 'american'] },
    { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Adventure', price: 13.99, description: 'A philosophical book about following your dreams.', isbn: '9780062315007', publishYear: 1988, tags: ['philosophy', 'adventure', 'inspirational'] },
    { title: 'Fahrenheit 451', author: 'Ray Bradbury', genre: 'Dystopian Fiction', price: 12.99, description: 'A dystopian novel about book burning and censorship.', isbn: '9781451673319', publishYear: 1953, tags: ['dystopian', 'sci-fi', 'classic'] },
    { title: 'Jane Eyre', author: 'Charlotte Brontë', genre: 'Romance', price: 11.99, description: 'The story of an orphaned governess and her love.', isbn: '9780141441146', publishYear: 1847, tags: ['classic', 'romance', 'gothic'] },
    { title: 'Wuthering Heights', author: 'Emily Brontë', genre: 'Gothic Fiction', price: 10.99, description: 'A tale of passion and revenge on the Yorkshire moors.', isbn: '9780141439556', publishYear: 1847, tags: ['classic', 'gothic', 'romance'] },
    { title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', genre: 'Philosophical Fiction', price: 9.99, description: 'A philosophical novel about beauty and morality.', isbn: '9780141439570', publishYear: 1890, tags: ['classic', 'philosophy', 'gothic'] },
    { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', genre: 'Psychological Fiction', price: 15.99, description: 'A novel about guilt and redemption.', isbn: '9780143058144', publishYear: 1866, tags: ['classic', 'psychological', 'russian'] },
    { title: 'The Odyssey', author: 'Homer', genre: 'Epic Poetry', price: 12.99, description: 'An ancient Greek epic about Odysseus\'s journey home.', isbn: '9780140268867', publishYear: -800, tags: ['classic', 'mythology', 'epic'] },
    { title: 'Don Quixote', author: 'Miguel de Cervantes', genre: 'Satire', price: 18.99, description: 'A Spanish novel about a nobleman who reads too many chivalric romances.', isbn: '9780060934347', publishYear: 1605, tags: ['classic', 'satire', 'adventure'] },
    
    { title: 'The Hunger Games', author: 'Suzanne Collins', genre: 'Dystopian Fiction', price: 14.99, description: 'A girl fights for survival in a televised death match.', isbn: '9780439023481', publishYear: 2008, tags: ['dystopian', 'young-adult', 'action'] },
    { title: 'Divergent', author: 'Veronica Roth', genre: 'Dystopian Fiction', price: 13.99, description: 'A society divided by virtues, one girl doesn\'t fit.', isbn: '9780062024022', publishYear: 2011, tags: ['dystopian', 'young-adult', 'action'] },
    { title: 'The Maze Runner', author: 'James Dashner', genre: 'Dystopian Fiction', price: 12.99, description: 'Teens trapped in a deadly maze must find a way out.', isbn: '9780385737951', publishYear: 2009, tags: ['dystopian', 'young-adult', 'thriller'] },
    { title: 'Twilight', author: 'Stephenie Meyer', genre: 'Romance', price: 11.99, description: 'A girl falls in love with a vampire.', isbn: '9780316015844', publishYear: 2005, tags: ['romance', 'fantasy', 'young-adult'] },
    { title: 'The Fault in Our Stars', author: 'John Green', genre: 'Young Adult', price: 10.99, description: 'Two teens with cancer fall in love.', isbn: '9780142424179', publishYear: 2012, tags: ['romance', 'young-adult', 'drama'] },
    
    { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Thriller', price: 14.99, description: 'A wife disappears on her anniversary.', isbn: '9780307588364', publishYear: 2012, tags: ['thriller', 'mystery', 'psychological'] },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genre: 'Mystery', price: 15.99, description: 'A journalist and hacker solve a murder mystery.', isbn: '9780307454546', publishYear: 2005, tags: ['mystery', 'thriller', 'crime'] },
    { title: 'The Da Vinci Code', author: 'Dan Brown', genre: 'Mystery', price: 13.99, description: 'A symbologist uncovers religious secrets.', isbn: '9780307474278', publishYear: 2003, tags: ['mystery', 'thriller', 'conspiracy'] },
    { title: 'Angels & Demons', author: 'Dan Brown', genre: 'Mystery', price: 13.99, description: 'Robert Langdon investigates the Illuminati.', isbn: '9780671027360', publishYear: 2000, tags: ['mystery', 'thriller', 'conspiracy'] },
    { title: 'The Girl on the Train', author: 'Paula Hawkins', genre: 'Thriller', price: 12.99, description: 'A woman witnesses something shocking from a train.', isbn: '9781594633669', publishYear: 2015, tags: ['thriller', 'mystery', 'psychological'] },
    
    { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', price: 16.99, description: 'A desert planet holds the key to the universe.', isbn: '9780441172719', publishYear: 1965, tags: ['sci-fi', 'epic', 'space'] },
    { title: 'Ender\'s Game', author: 'Orson Scott Card', genre: 'Science Fiction', price: 14.99, description: 'A child genius is trained to save humanity.', isbn: '9780312853235', publishYear: 1985, tags: ['sci-fi', 'military', 'young-adult'] },
    { title: 'The Martian', author: 'Andy Weir', genre: 'Science Fiction', price: 15.99, description: 'An astronaut survives alone on Mars.', isbn: '9780553418026', publishYear: 2011, tags: ['sci-fi', 'survival', 'space'] },
    { title: 'Ready Player One', author: 'Ernest Cline', genre: 'Science Fiction', price: 14.99, description: 'A virtual reality treasure hunt.', isbn: '9780307887436', publishYear: 2011, tags: ['sci-fi', 'gaming', 'adventure'] },
    { title: 'Neuromancer', author: 'William Gibson', genre: 'Science Fiction', price: 13.99, description: 'A hacker in a dystopian future.', isbn: '9780441569595', publishYear: 1984, tags: ['sci-fi', 'cyberpunk', 'dystopian'] },
    
    { title: 'The Shining', author: 'Stephen King', genre: 'Horror', price: 14.99, description: 'A family caretakes a haunted hotel.', isbn: '9780385121675', publishYear: 1977, tags: ['horror', 'thriller', 'supernatural'] },
    { title: 'It', author: 'Stephen King', genre: 'Horror', price: 16.99, description: 'Children face an evil entity in their town.', isbn: '9780450411434', publishYear: 1986, tags: ['horror', 'thriller', 'supernatural'] },
    { title: 'Carrie', author: 'Stephen King', genre: 'Horror', price: 12.99, description: 'A bullied girl discovers telekinetic powers.', isbn: '9780385086950', publishYear: 1974, tags: ['horror', 'thriller', 'supernatural'] },
    { title: 'Dracula', author: 'Bram Stoker', genre: 'Horror', price: 11.99, description: 'The classic vampire tale.', isbn: '9780141439846', publishYear: 1897, tags: ['horror', 'classic', 'vampire'] },
    { title: 'Frankenstein', author: 'Mary Shelley', genre: 'Horror', price: 10.99, description: 'A scientist creates life with terrible consequences.', isbn: '9780141439471', publishYear: 1818, tags: ['horror', 'classic', 'sci-fi'] },
    
    { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-Fiction', price: 19.99, description: 'A brief history of humankind.', isbn: '9780062316097', publishYear: 2011, tags: ['history', 'science', 'philosophy'] },
    { title: 'Educated', author: 'Tara Westover', genre: 'Memoir', price: 16.99, description: 'A woman escapes her survivalist family through education.', isbn: '9780399590504', publishYear: 2018, tags: ['memoir', 'biography', 'inspirational'] },
    { title: 'Becoming', author: 'Michelle Obama', genre: 'Memoir', price: 17.99, description: 'The former First Lady\'s memoir.', isbn: '9781524763138', publishYear: 2018, tags: ['memoir', 'biography', 'politics'] },
    { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', price: 15.99, description: 'Tiny changes that create remarkable results.', isbn: '9780735211292', publishYear: 2018, tags: ['self-help', 'productivity', 'psychology'] },
    { title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey', genre: 'Self-Help', price: 14.99, description: 'Principles for personal effectiveness.', isbn: '9781982137274', publishYear: 1989, tags: ['self-help', 'business', 'productivity'] },
    
    { title: 'A Game of Thrones', author: 'George R.R. Martin', genre: 'Fantasy', price: 19.99, description: 'Noble families vie for control of the Iron Throne.', isbn: '9780553103540', publishYear: 1996, tags: ['fantasy', 'epic', 'medieval'] },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', genre: 'Fantasy', price: 17.99, description: 'A legendary hero tells his story.', isbn: '9780756404079', publishYear: 2007, tags: ['fantasy', 'magic', 'adventure'] },
    { title: 'Mistborn', author: 'Brandon Sanderson', genre: 'Fantasy', price: 16.99, description: 'A street urchin overthrows an empire.', isbn: '9780765350381', publishYear: 2006, tags: ['fantasy', 'magic', 'heist'] },
    { title: 'The Way of Kings', author: 'Brandon Sanderson', genre: 'Fantasy', price: 18.99, description: 'Epic fantasy with unique magic system.', isbn: '9780765326355', publishYear: 2010, tags: ['fantasy', 'epic', 'magic'] },
    { title: 'American Gods', author: 'Neil Gaiman', genre: 'Fantasy', price: 15.99, description: 'Old gods battle new in modern America.', isbn: '9780380789030', publishYear: 2001, tags: ['fantasy', 'mythology', 'modern'] },
    
    { title: 'The Handmaid\'s Tale', author: 'Margaret Atwood', genre: 'Dystopian Fiction', price: 13.99, description: 'Women are enslaved in a totalitarian regime.', isbn: '9780385490818', publishYear: 1985, tags: ['dystopian', 'feminist', 'classic'] },
    { title: 'The Road', author: 'Cormac McCarthy', genre: 'Post-Apocalyptic', price: 14.99, description: 'A father and son journey through a destroyed world.', isbn: '9780307387899', publishYear: 2006, tags: ['post-apocalyptic', 'drama', 'survival'] },
    { title: 'Station Eleven', author: 'Emily St. John Mandel', genre: 'Post-Apocalyptic', price: 13.99, description: 'Survivors navigate life after a pandemic.', isbn: '9780385353304', publishYear: 2014, tags: ['post-apocalyptic', 'drama', 'literary'] },
    { title: 'The Stand', author: 'Stephen King', genre: 'Post-Apocalyptic', price: 17.99, description: 'Survivors of a plague face off in a battle of good vs evil.', isbn: '9780307743688', publishYear: 1978, tags: ['post-apocalyptic', 'horror', 'epic'] },
    
    { title: 'The Kite Runner', author: 'Khaled Hosseini', genre: 'Historical Fiction', price: 14.99, description: 'A story of friendship and redemption in Afghanistan.', isbn: '9781594631931', publishYear: 2003, tags: ['historical', 'drama', 'afghanistan'] },
    { title: 'The Book Thief', author: 'Markus Zusak', genre: 'Historical Fiction', price: 13.99, description: 'A girl steals books in Nazi Germany.', isbn: '9780375842207', publishYear: 2005, tags: ['historical', 'wwii', 'drama'] },
    { title: 'All the Light We Cannot See', author: 'Anthony Doerr', genre: 'Historical Fiction', price: 15.99, description: 'A blind French girl and German boy during WWII.', isbn: '9781476746586', publishYear: 2014, tags: ['historical', 'wwii', 'literary'] },
    { title: 'The Nightingale', author: 'Kristin Hannah', genre: 'Historical Fiction', price: 14.99, description: 'Two sisters in France during WWII.', isbn: '9780312577223', publishYear: 2015, tags: ['historical', 'wwii', 'drama'] },
    { title: 'The Pillars of the Earth', author: 'Ken Follett', genre: 'Historical Fiction', price: 18.99, description: 'Building a cathedral in 12th century England.', isbn: '9780451166890', publishYear: 1989, tags: ['historical', 'medieval', 'epic'] },
    
    { title: 'Where the Crawdads Sing', author: 'Delia Owens', genre: 'Mystery', price: 15.99, description: 'A girl raised in the marshes is accused of murder.', isbn: '9780735219090', publishYear: 2018, tags: ['mystery', 'nature', 'romance'] },
    { title: 'Big Little Lies', author: 'Liane Moriarty', genre: 'Mystery', price: 13.99, description: 'Mothers in an Australian town hide secrets.', isbn: '9780399167065', publishYear: 2014, tags: ['mystery', 'drama', 'thriller'] },
    { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', price: 14.99, description: 'A woman stops speaking after shooting her husband.', isbn: '9781250301697', publishYear: 2019, tags: ['thriller', 'psychological', 'mystery'] },
    { title: 'Sharp Objects', author: 'Gillian Flynn', genre: 'Thriller', price: 13.99, description: 'A journalist returns to her hometown to cover murders.', isbn: '9780307341556', publishYear: 2006, tags: ['thriller', 'mystery', 'psychological'] },
    
    { title: 'Normal People', author: 'Sally Rooney', genre: 'Contemporary Fiction', price: 12.99, description: 'The complex relationship between two Irish teenagers.', isbn: '9781984822178', publishYear: 2018, tags: ['contemporary', 'romance', 'literary'] },
    { title: 'Eleanor Oliphant Is Completely Fine', author: 'Gail Honeyman', genre: 'Contemporary Fiction', price: 13.99, description: 'An eccentric woman learns to connect with others.', isbn: '9780735220683', publishYear: 2017, tags: ['contemporary', 'drama', 'quirky'] },
    { title: 'A Man Called Ove', author: 'Fredrik Backman', genre: 'Contemporary Fiction', price: 14.99, description: 'A grumpy old man finds friendship and purpose.', isbn: '9781476738024', publishYear: 2012, tags: ['contemporary', 'humor', 'heartwarming'] },
    { title: 'The Rosie Project', author: 'Graeme Simsion', genre: 'Romance', price: 12.99, description: 'A genetics professor seeks the perfect wife.', isbn: '9781476729084', publishYear: 2013, tags: ['romance', 'humor', 'contemporary'] },
    { title: 'Me Before You', author: 'Jojo Moyes', genre: 'Romance', price: 11.99, description: 'A caregiver falls for her quadriplegic patient.', isbn: '9780670026609', publishYear: 2012, tags: ['romance', 'drama', 'tearjerker'] },
    
    { title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', genre: 'Self-Help', price: 14.99, description: 'A counterintuitive approach to living a good life.', isbn: '9780062457714', publishYear: 2016, tags: ['self-help', 'philosophy', 'humor'] },
    { title: 'Think and Grow Rich', author: 'Napoleon Hill', genre: 'Self-Help', price: 13.99, description: 'Principles of success and wealth.', isbn: '9781585424337', publishYear: 1937, tags: ['self-help', 'business', 'classic'] },
    { title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', genre: 'Self-Help', price: 12.99, description: 'Timeless advice on human relations.', isbn: '9780671027032', publishYear: 1936, tags: ['self-help', 'communication', 'classic'] },
    { title: 'The Power of Now', author: 'Eckhart Tolle', genre: 'Self-Help', price: 15.99, description: 'A guide to spiritual enlightenment.', isbn: '9781577314806', publishYear: 1997, tags: ['self-help', 'spirituality', 'mindfulness'] },
    { title: 'Can\'t Hurt Me', author: 'David Goggins', genre: 'Memoir', price: 16.99, description: 'A Navy SEAL\'s guide to mastering your mind.', isbn: '9781544512273', publishYear: 2018, tags: ['memoir', 'motivation', 'military'] },
    
    { title: 'The Percy Jackson Series', author: 'Rick Riordan', genre: 'Fantasy', price: 29.99, description: 'A boy discovers he is a demigod.', isbn: '9781423145509', publishYear: 2005, tags: ['fantasy', 'mythology', 'young-adult'] },
    { title: 'The Mortal Instruments', author: 'Cassandra Clare', genre: 'Fantasy', price: 28.99, description: 'A girl discovers the world of Shadowhunters.', isbn: '9781481455923', publishYear: 2007, tags: ['fantasy', 'urban', 'young-adult'] },
    { title: 'Six of Crows', author: 'Leigh Bardugo', genre: 'Fantasy', price: 15.99, description: 'A gang of thieves plans an impossible heist.', isbn: '9781627792127', publishYear: 2015, tags: ['fantasy', 'heist', 'young-adult'] },
    { title: 'The Cruel Prince', author: 'Holly Black', genre: 'Fantasy', price: 14.99, description: 'A human girl navigates the treacherous fae court.', isbn: '9780316310277', publishYear: 2018, tags: ['fantasy', 'fae', 'young-adult'] },
    { title: 'Shadow and Bone', author: 'Leigh Bardugo', genre: 'Fantasy', price: 13.99, description: 'An orphan discovers a unique magical power.', isbn: '9780805094596', publishYear: 2012, tags: ['fantasy', 'magic', 'young-adult'] },
    
    { title: 'The Witcher: The Last Wish', author: 'Andrzej Sapkowski', genre: 'Fantasy', price: 14.99, description: 'A monster hunter navigates a dark world.', isbn: '9780316029186', publishYear: 1993, tags: ['fantasy', 'monsters', 'dark'] },
    { title: 'Good Omens', author: 'Neil Gaiman', genre: 'Fantasy', price: 13.99, description: 'An angel and demon team up to prevent the apocalypse.', isbn: '9780060853983', publishYear: 1990, tags: ['fantasy', 'humor', 'apocalyptic'] },
    { title: 'The Ocean at the End of the Lane', author: 'Neil Gaiman', genre: 'Fantasy', price: 12.99, description: 'A man returns to his childhood home and remembers magic.', isbn: '9780062255655', publishYear: 2013, tags: ['fantasy', 'dark', 'literary'] },
    { title: 'Neverwhere', author: 'Neil Gaiman', genre: 'Fantasy', price: 13.99, description: 'A man discovers a magical London beneath the streets.', isbn: '9780380789016', publishYear: 1996, tags: ['fantasy', 'urban', 'adventure'] },
    { title: 'The Graveyard Book', author: 'Neil Gaiman', genre: 'Fantasy', price: 11.99, description: 'A boy raised by ghosts in a graveyard.', isbn: '9780060530945', publishYear: 2008, tags: ['fantasy', 'children', 'dark'] },
    
    { title: 'The Three-Body Problem', author: 'Liu Cixin', genre: 'Science Fiction', price: 16.99, description: 'Humanity\'s first contact with an alien civilization.', isbn: '9780765382030', publishYear: 2008, tags: ['sci-fi', 'hard-sf', 'chinese'] },
    { title: 'Foundation', author: 'Isaac Asimov', genre: 'Science Fiction', price: 15.99, description: 'A mathematician predicts the fall of civilization.', isbn: '9780553293357', publishYear: 1951, tags: ['sci-fi', 'classic', 'space'] },
    { title: 'I, Robot', author: 'Isaac Asimov', genre: 'Science Fiction', price: 13.99, description: 'Stories exploring the Three Laws of Robotics.', isbn: '9780553382563', publishYear: 1950, tags: ['sci-fi', 'robots', 'classic'] },
    { title: 'Snow Crash', author: 'Neal Stephenson', genre: 'Science Fiction', price: 14.99, description: 'A hacker uncovers a digital virus in a cyberpunk future.', isbn: '9780553380958', publishYear: 1992, tags: ['sci-fi', 'cyberpunk', 'virtual-reality'] },
    { title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', genre: 'Science Fiction', price: 12.99, description: 'A comedic journey through space.', isbn: '9780345391803', publishYear: 1979, tags: ['sci-fi', 'humor', 'space'] },
    
    { title: 'Circe', author: 'Madeline Miller', genre: 'Mythology', price: 15.99, description: 'The story of the witch from Greek mythology.', isbn: '9780316556347', publishYear: 2018, tags: ['mythology', 'fantasy', 'feminist'] },
    { title: 'The Song of Achilles', author: 'Madeline Miller', genre: 'Mythology', price: 14.99, description: 'The love story of Achilles and Patroclus.', isbn: '9780062060624', publishYear: 2011, tags: ['mythology', 'romance', 'historical'] },
    { title: 'Norse Mythology', author: 'Neil Gaiman', genre: 'Mythology', price: 16.99, description: 'Gaiman retells classic Norse myths.', isbn: '9780393609097', publishYear: 2017, tags: ['mythology', 'fantasy', 'norse'] },
    { title: 'The Odyssey', author: 'Emily Wilson', genre: 'Mythology', price: 17.99, description: 'A new translation of Homer\'s epic.', isbn: '9780393089059', publishYear: 2017, tags: ['mythology', 'classic', 'epic'] },
    
    { title: 'The Shadow of the Wind', author: 'Carlos Ruiz Zafón', genre: 'Mystery', price: 14.99, description: 'A boy discovers a mysterious book in Barcelona.', isbn: '9780143034902', publishYear: 2001, tags: ['mystery', 'literary', 'spanish'] },
    { title: 'The Name of the Rose', author: 'Umberto Eco', genre: 'Mystery', price: 16.99, description: 'Murders in a medieval monastery.', isbn: '9780156001311', publishYear: 1980, tags: ['mystery', 'historical', 'philosophical'] },
    { title: 'In the Woods', author: 'Tana French', genre: 'Mystery', price: 13.99, description: 'A detective investigates a murder near where he survived a childhood tragedy.', isbn: '9780143113492', publishYear: 2007, tags: ['mystery', 'thriller', 'irish'] },
    { title: 'The Cuckoo\'s Calling', author: 'Robert Galbraith', genre: 'Mystery', price: 14.99, description: 'A private detective investigates a supermodel\'s death.', isbn: '9780316206846', publishYear: 2013, tags: ['mystery', 'detective', 'contemporary'] },
    { title: 'And Then There Were None', author: 'Agatha Christie', genre: 'Mystery', price: 11.99, description: 'Ten strangers invited to an island begin to die one by one.', isbn: '9780062073488', publishYear: 1939, tags: ['mystery', 'classic', 'suspense'] },
  ]

  const books = []
  for (const bookData of booksData) {
    const book = await prisma.book.create({
      data: bookData
    })
    books.push(book)
  }

  console.log('Creating interactions...')
  const interactionTypes = ['view', 'like', 'purchase']
  
  for (let i = 0; i < 500; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)]
    const randomBook = books[Math.floor(Math.random() * books.length)]
    const randomType = interactionTypes[Math.floor(Math.random() * interactionTypes.length)]
    
    try {
      await prisma.interaction.create({
        data: {
          userId: randomUser.id,
          bookId: randomBook.id,
          type: randomType
        }
      })
    } catch (e) {
    }
  }

  console.log('Seed completed!')
  console.log(`Created ${users.length} users`)
  console.log(`Created ${books.length} books`)
  console.log('Created ~500 interactions')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })