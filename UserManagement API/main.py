from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ---------------- DATABASE ----------------
engine = create_engine(
    "mysql+pymysql://root:monika123@localhost/usersdatabase"
)

Session = sessionmaker(bind=engine)
Base = declarative_base()


# ===== JWT CONFIG =====

from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
SECRET_KEY = "kmedtech_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(
    plain_password,
    hashed_password
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )

def create_access_token(data: dict):


    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=30)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )
    
def admin_only(
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user



# ---------------- USERS TABLE ----------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    mobile = Column(String(15))

# ---------------- REGISTERED USERS TABLE ----------------
class RegisteredUser(Base):
    __tablename__ = "registered_users"

    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True)
    email = Column(String(100))
    password = Column(String(255))
    role = Column(String(20), default="User")
    


# Create tables
Base.metadata.create_all(engine)

# ---------------- PYDANTIC MODELS ----------------
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = "User"
class LoginRequest(BaseModel):
    username: str
    password: str

class UserRequest(BaseModel):
    name: str
    mobile: str

# ---------------- FASTAPI APP ----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ---------------- REGISTER ----------------
@app.post("/register")
async def register(data: RegisterRequest):
    session = Session()

    check = session.query(RegisteredUser).filter_by(
        username=data.username
    ).first()

    if check:
        session.close()
        return JSONResponse(
            content={"msg": "User already exists"},
            status_code=400
        )

    obj = RegisteredUser(
    username=data.username,
    email=data.email,
    password=hash_password(data.password),
    role=data.role
)

    session.add(obj)
    session.commit()
    session.close()

    return {"msg": "Registered Successfully"}

# ---------------- LOGIN ----------------
@app.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    session = Session()

    user = session.query(RegisteredUser).filter_by(
        username=form_data.username
    ).first()
    print("USER FOUND:", user)

    if not user:
        session.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid Username or Password"
        )

    if not verify_password(
        form_data.password,
        user.password
    ):
        session.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid Username or Password"
        )

    token = create_access_token(
        {
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    )

    session.close()

    return {
        "access_token": token,
        "token_type": "bearer"
    }

# ---------------- CREATE USER ----------------
@app.post("/add_users")
async def add_user(data: UserRequest):
    session = Session()

    obj = User(
        name=data.name,
        mobile=data.mobile
    )

    session.add(obj)
    session.commit()
    session.close()

    return {"msg": "User Added Successfully"}

# ---------------- READ USERS ----------------
@app.get("/all")
def get_all(
    current_user: dict = Depends(admin_only)
):
    session = Session()

    rows = session.query(User).all()

    result = [
        {
            "id": row.id,
            "name": row.name,
            "mobile": row.mobile
        }
        for row in rows
    ]

    session.close()
    return result
@app.get("/user/{id}")
def get_user(
    id: int,
    current_user: dict = Depends(get_current_user)
):
    session = Session()

    user = session.query(User).filter_by(id=id).first()

    if not user:
        session.close()
        return JSONResponse(
            content={"msg": "User Not Found"},
            status_code=404
        )

    result = {
        "id": user.id,
        "name": user.name,
        "mobile": user.mobile
    }

    session.close()

    return result

@app.get("/all/RegisteredUsers")
def get_all_registered_users():
    session = Session()

    rows = session.query(RegisteredUser).all()

    result = [
        {
            "id": row.id,
            "username": row.username,
            "email": row.email
        }
        for row in rows
    ]

    session.close()
    return result

# ---------------- UPDATE USER ----------------
@app.put("/update/{id}")
async def update_user(
    id: int,
    data: UserRequest,
    current_user: dict = Depends(admin_only)
):
    session = Session()

    obj = session.query(User).filter_by(id=id).first()

    if not obj:
        session.close()
        return JSONResponse(
            content={"msg": "User Not Found"},
            status_code=404
        )

    obj.name = data.name
    obj.mobile = data.mobile

    session.commit()
    session.close()

    return {"msg": "User Updated Successfully"}

# ---------------- DELETE USER ----------------
@app.delete("/delete/{id}")
def delete_user(
    id: int,
    current_user: dict = Depends(admin_only)
):
    session = Session()

    obj = session.query(User).filter_by(id=id).first()

    if not obj:
        session.close()
        return JSONResponse(
            content={"msg": "User Not Found"},
            status_code=404
        )

    session.delete(obj)
    session.commit()
    session.close()

    return {"msg": "User Deleted Successfully"}

# ---------------- HOME ----------------
@app.get("/")
def home():
    return {
        "msg": "FastAPI CRUD is running successfully"
    }