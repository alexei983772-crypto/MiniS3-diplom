#include <iostream>
#include <fstream>
#include <filesystem>
#include <string>
#include <thread>
#include <chrono>
#include <ctime>

#include "httplib.h"

namespace fs = std::filesystem;

// ================= CONFIG =================

const std::string STORAGE_PATH = "./storage";

const std::string BACKEND_HOST = "localhost";
const int BACKEND_PORT = 3000;

const std::string NODE_HOST = "localhost";
const int PORT = 3001;

// ================= UTIL =================

void ensure_storage() {
    if (!fs::exists(STORAGE_PATH)) {
        fs::create_directories(STORAGE_PATH);
    }
}

std::string file_path(const std::string& id) {
    return STORAGE_PATH + "/" + id;
}

std::string node_url() {
    return "http://" + NODE_HOST + ":" + std::to_string(PORT);
}

// ================= REGISTER =================

void register_node() {
    httplib::Client cli(BACKEND_HOST, BACKEND_PORT);

    cli.set_connection_timeout(5);
    cli.set_read_timeout(5);

    std::string body =
        "{\"url\":\"" + node_url() + "\"}";

    std::cout << "[NODE] Registering: " << node_url() << std::endl;

    auto res = cli.Post(
        "/nodes/register",
        body,
        "application/json"
    );

    if (!res) {
        std::cout << "[NODE] Register FAILED" << std::endl;
        return;
    }

    std::cout << "[NODE] Register OK: "
              << res->status
              << " "
              << res->body
              << std::endl;
}

// ================= HEARTBEAT =================

void heartbeat_loop() {
    while (true) {
        httplib::Client cli(BACKEND_HOST, BACKEND_PORT);

        cli.set_connection_timeout(5);
        cli.set_read_timeout(5);

        std::string body =
            "{\"url\":\"" + node_url() + "\"}";

        auto res = cli.Post(
            "/nodes/heartbeat",
            body,
            "application/json"
        );

        if (!res) {
            std::cout << "[NODE] Heartbeat FAILED" << std::endl;
        } else {
            std::cout << "[NODE] Heartbeat OK" << std::endl;
        }

        std::this_thread::sleep_for(
            std::chrono::seconds(5)
        );
    }
}

// ================= MAIN =================

int main() {
    ensure_storage();

    httplib::Server app;

    // ================= UPLOAD =================

    app.Post("/store/upload",
        [](const httplib::Request& req,
           httplib::Response& res) {

        std::string filename =
            req.get_header_value("x-filename");

        if (filename.empty()) {
            filename =
                "file_" +
                std::to_string(std::time(nullptr));
        }

        std::string path = file_path(filename);

        std::ofstream file(
            path,
            std::ios::binary
        );

        if (!file.is_open()) {
            res.status = 500;
            res.set_content(
                "{\"error\":\"cannot write file\"}",
                "application/json"
            );
            return;
        }

        file.write(
            req.body.data(),
            static_cast<std::streamsize>(
                req.body.size()
            )
        );

        file.close();

        std::cout
            << "[UPLOAD] "
            << filename
            << " size="
            << req.body.size()
            << " bytes"
            << std::endl;

        std::string response =
            "{"
            "\"success\":true,"
            "\"fileId\":\"" + filename + "\","
            "\"size\":" +
            std::to_string(req.body.size()) +
            "}";

        res.set_content(
            response,
            "application/json"
        );
    });

    // ================= DOWNLOAD =================

    app.Get(R"(/store/(.*))",
        [](const httplib::Request& req,
           httplib::Response& res) {

        std::string fileId =
            req.matches[1];

        std::string path =
            file_path(fileId);

        if (!fs::exists(path)) {
            res.status = 404;
            res.set_content(
                "{\"error\":\"not found\"}",
                "application/json"
            );
            return;
        }

        std::ifstream file(
            path,
            std::ios::binary
        );

        std::string data(
            (std::istreambuf_iterator<char>(file)),
            std::istreambuf_iterator<char>()
        );

        res.set_content(
            data,
            "application/octet-stream"
        );
    });

    // ================= DELETE =================

    app.Delete(R"(/store/(.*))",
        [](const httplib::Request& req,
           httplib::Response& res) {

        std::string fileId =
            req.matches[1];

        std::string path =
            file_path(fileId);

        if (!fs::exists(path)) {
            res.status = 404;
            res.set_content(
                "{\"error\":\"not found\"}",
                "application/json"
            );
            return;
        }

        fs::remove(path);

        std::cout
            << "[DELETE] "
            << fileId
            << std::endl;

        res.set_content(
            "{\"success\":true}",
            "application/json"
        );
    });

    // ================= HEALTH =================

    app.Get("/health",
        [](const httplib::Request&,
           httplib::Response& res) {

        res.set_content(
            "{\"status\":\"online\"}",
            "application/json"
        );
    });

    // ================= START =================

    std::thread(register_node).detach();
    std::thread(heartbeat_loop).detach();

    std::cout
        << "Node Storage started on port "
        << PORT
        << std::endl;

    app.listen("0.0.0.0", PORT);

    return 0;
}